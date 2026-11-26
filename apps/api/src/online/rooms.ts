import { createDuelState, createRaceState, generateSecret, seededIndexSource, submitDuelAttempt, submitRaceAttempt, type DuelState, type GameConfig, type RaceState, type PlayerResult } from '@picas-fijas/game-core';
import { createHash, randomBytes } from 'node:crypto';
import type { OnlineConfig } from './config.js';
import { errorResponse, PROTOCOL_VERSION, type AttemptView, type OnlineCommand, type OnlineError, type OnlineResponse, type OnlineMode, type Participant, type ParticipantSnapshot, type RoomSummary } from './protocol.js';

type Cycle = DuelState | RaceState;
interface Member { id: string; nickname: string; credentialHash: string; connected: boolean; ready: boolean; secret?: string; }
const NICKNAMES = ['Luna', 'Rayo'];
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code = () => Array.from(randomBytes(5), (byte) => alphabet[byte % alphabet.length]).join('');
const credential = () => randomBytes(24).toString('base64url');
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const safeCode = (value: string) => /^[A-HJ-NP-Z2-9]{5}$/.test(value);

export class RoomActor {
  readonly code: string;
  readonly mode: OnlineMode;
  readonly createdAt: number;
  private version = 0;
  private members: Member[] = [];
  private cycle: Cycle | undefined;
  private phase: RoomSummary['phase'] = 'waiting';
  private readonly results = new Map<string, OnlineResponse>();
  constructor(mode: OnlineMode, private readonly config: OnlineConfig, now = Date.now(), roomCode = code()) { this.mode = mode; this.createdAt = now; this.code = roomCode; }
  get stateVersion() { return this.version; }
  get expiresAt() { return this.createdAt + this.config.roomTtlMs; }
  expired(now = Date.now()) { return now >= this.expiresAt; }
  private fail(command: OnlineCommand, error: OnlineError): OnlineResponse { return errorResponse(command.commandId, this.version, error); }
  private find(credentialValue?: string) { return this.members.find((member) => credentialValue && member.credentialHash === hash(credentialValue)); }
  private summary(): RoomSummary { return { code: this.code, mode: this.mode, phase: this.phase, participants: this.members.map(({ id, nickname, connected, ready }) => ({ id, nickname, connected, ready })), stateVersion: this.version, expiresAt: this.expiresAt }; }
  snapshot(member: Member): ParticipantSnapshot { 
    const ownAttempts: AttemptView[] = this.cycle?.kind === 'duel' ? this.cycle.histories[member.id].map((a) => ({ guess: a.guess, at: a.at, score: a.score })) : this.cycle?.kind === 'race' ? this.cycle.history.filter((a) => a.player === member.id).map((a) => ({ guess: a.guess, at: a.at, score: a.score })) : [];
    const result = this.cycle?.result;
    const players = result && 'players' in result ? (result as { players?: PlayerResult[] }).players : undefined;
    return { room: this.summary(), participant: { id: member.id, nickname: member.nickname, connected: member.connected, ready: member.ready }, cycle: this.cycle ? { kind: this.mode, stateVersion: this.version, phase: this.phase, currentPlayer: this.cycle.kind === 'duel' ? this.cycle.currentPlayer : undefined, deadline: this.cycle.kind === 'race' ? this.cycle.deadline : undefined, ownAttempts, result: result ? { outcome: result.outcome, reason: result.reason, winner: result.winner, players } : undefined } : undefined };
  }
  private success(command: OnlineCommand, member: Member): OnlineResponse { return { protocolVersion: PROTOCOL_VERSION, commandId: command.commandId, accepted: true, stateVersion: this.version, snapshot: this.snapshot(member) }; }
  handle(command: OnlineCommand, credentialValue?: string, now = Date.now()): OnlineResponse {
    if (this.expired(now)) return this.fail(command, { code: 'EXPIRED', message: 'La sala expiró.', recoverable: false });
    const key = `${this.find(credentialValue)?.id ?? 'new'}:${command.idempotencyKey ?? command.commandId}`;
    const previous = this.results.get(key); if (previous) return previous;
    let member = this.find(credentialValue);
    if (command.type === 'join') {
      if (this.members.length >= 2) return this.fail(command, { code: 'ROOM_FULL', message: 'La sala ya tiene dos participantes.', recoverable: true });
      if (command.payload.roomCode !== this.code || !safeCode(this.code)) return this.fail(command, { code: 'ROOM_NOT_FOUND', message: 'Sala no disponible.', recoverable: true });
      const secret = credential(); member = { id: `p${this.members.length + 1}`, nickname: NICKNAMES[this.members.length], credentialHash: hash(secret), connected: true, ready: false };
      this.members.push(member); if (this.members.length === 2) this.phase = 'ready'; this.version += 1;
      const response = this.success(command, member); response.credential = secret; this.results.set(key, response); return response;
    }
    if (!member) return this.fail(command, { code: 'CREDENTIAL_DENIED', message: 'Credencial no autorizada.', recoverable: true });
    member.connected = true;
    if (command.type === 'reconnect') { const response = this.success(command, member); this.results.set(key, response); return response; }
    if (command.type === 'ready') { member.ready = true; if (this.members.length === 2 && this.members.every((entry) => entry.ready)) { this.startCycle(now); this.phase = 'playing'; } this.version += 1; }
    else if (command.type === 'submitGuess') {
      if (typeof command.payload.guess !== 'string') return this.fail(command, { code: 'INVALID_GUESS', message: 'Tentativa inválida.', recoverable: true });
      if (!this.cycle) return this.fail(command, { code: 'NOT_READY', message: 'La partida aún no está lista.', recoverable: true });
      const transition = this.cycle.kind === 'duel' ? submitDuelAttempt(this.cycle, member.id, command.payload.guess, now) : submitRaceAttempt(this.cycle, member.id, command.payload.guess, now);
      if (transition.error) return this.fail(command, { code: transition.error.code === 'NOT_YOUR_TURN' ? 'OUT_OF_TURN' : 'INVALID_GUESS', message: transition.error.message, recoverable: true });
      this.cycle = transition.state; this.version += 1; if (this.cycle.finished) this.phase = 'finished';
    } else if (command.type === 'leave') { member.connected = false; member.ready = false; this.version += 1; if (this.members.every((entry) => !entry.connected)) this.phase = 'waiting'; }
    else if (command.type === 'rematch') { member.ready = true; if (this.members.every((entry) => entry.ready)) { this.startCycle(now); this.phase = 'playing'; this.version += 1; } }
    const response = this.success(command, member); this.results.set(key, response); return response;
  }
  private startCycle(now: number) {
    const config = this.defaultGameConfig(); const seed = this.createdAt >>> 0;
    if (this.mode === 'duel') { const secrets = Object.fromEntries(this.members.map((member, index) => [member.id, member.secret ?? generateSecret(config, seededIndexSource(seed + index + 1))])); this.cycle = createDuelState(config, secrets, now); }
    else this.cycle = createRaceState(config, generateSecret(config, seededIndexSource(seed + 9)), now);
    this.members.forEach((member) => { member.ready = false; });
  }
  private defaultGameConfig(): GameConfig { return { length: 3, repeats: false, maxAttempts: null, raceDurationSeconds: this.config.raceDurationSeconds, turnDurationSeconds: 60 }; }
}

export class RoomRegistry {
  private readonly rooms = new Map<string, RoomActor>();
  constructor(private readonly config: OnlineConfig) {}
  create(mode: OnlineMode, now = Date.now()) { const room = new RoomActor(mode, this.config, now); this.rooms.set(room.code, room); return room; }
  get(roomCode: string, now = Date.now()) { const room = this.rooms.get(roomCode); if (!room || room.expired(now)) { if (room) this.rooms.delete(roomCode); return undefined; } return room; }
  deleteExpired(now = Date.now()) { for (const [roomCode, room] of this.rooms) if (room.expired(now)) this.rooms.delete(roomCode); }
  size() { return this.rooms.size; }
}
