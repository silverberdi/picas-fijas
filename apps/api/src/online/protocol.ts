import type { GameConfig, IndividualOutcome, PlayerResult, Score } from '@picas-fijas/game-core';

export const PROTOCOL_VERSION = 'v1' as const;
export type OnlineMode = 'duel' | 'race';
export type CommandType = 'create' | 'join' | 'reconnect' | 'disconnect' | 'resign' | 'restart' | 'ready' | 'submitGuess' | 'leave' | 'rematch';
export type ErrorCode = 'INVALID_MESSAGE' | 'ORIGIN_DENIED' | 'ROOM_NOT_FOUND' | 'ROOM_FULL' | 'CREDENTIAL_DENIED' | 'EXPIRED' | 'OUT_OF_TURN' | 'RATE_LIMITED' | 'PAYLOAD_TOO_LARGE' | 'NOT_READY' | 'INVALID_GUESS' | 'INVALID_SECRET' | 'GAME_FINISHED' | 'GRACE_EXPIRED';
export interface OnlineError { code: ErrorCode; message: string; recoverable: boolean; }
export interface Participant { id: string; nickname: string; connected: boolean; ready: boolean; }
export interface RoomSummary { code: string; mode: OnlineMode; phase: 'waiting' | 'ready' | 'playing' | 'reconnecting' | 'finished'; participants: readonly Participant[]; stateVersion: number; expiresAt: number; grace?: { paused: boolean; expiresAt?: number; remainingMs?: number }; }
export interface CycleSnapshot { kind: OnlineMode; stateVersion: number; phase: RoomSummary['phase']; currentPlayer?: string; deadline?: number; ownAttempts: readonly AttemptView[]; result?: { outcome: string; reason: string; winner?: string; label?: string; players?: readonly PlayerResult[] }; }
export interface AttemptView { guess: string; at: number; score: Pick<Score, 'fixed' | 'picas' | 'exact'>; }
export interface ParticipantSnapshot { room: RoomSummary; participant: Participant; cycle?: CycleSnapshot; }
export interface CommandPayload { mode?: OnlineMode; config?: GameConfig; secret?: string; roomCode?: string; credential?: string; guess?: string; }
export interface OnlineCommand { protocolVersion: typeof PROTOCOL_VERSION; commandId: string; idempotencyKey?: string; type: CommandType; payload: CommandPayload; }
export interface OnlineResponse { protocolVersion: typeof PROTOCOL_VERSION; commandId: string; accepted: boolean; stateVersion: number; snapshot?: ParticipantSnapshot; credential?: string; error?: OnlineError; }

const commandTypes = new Set<CommandType>(['create', 'join', 'reconnect', 'disconnect', 'resign', 'restart', 'ready', 'submitGuess', 'leave', 'rematch']);
export function parseCommand(input: unknown): OnlineCommand | OnlineError {
  if (!input || typeof input !== 'object') return { code: 'INVALID_MESSAGE', message: 'El mensaje debe ser un objeto JSON.', recoverable: true };
  const value = input as Record<string, unknown>;
  const keys = Object.keys(value);
  if (keys.some((key) => !['protocolVersion', 'commandId', 'idempotencyKey', 'type', 'payload'].includes(key))) return { code: 'INVALID_MESSAGE', message: 'El mensaje contiene campos desconocidos.', recoverable: true };
  if (value.protocolVersion !== PROTOCOL_VERSION || typeof value.commandId !== 'string' || !commandTypes.has(value.type as CommandType) || !value.payload || typeof value.payload !== 'object') return { code: 'INVALID_MESSAGE', message: 'El comando no cumple el protocolo v1.', recoverable: true };
  const payload = value.payload as Record<string, unknown>;
  if (Object.keys(payload).some((key) => !['mode', 'config', 'secret', 'roomCode', 'credential', 'guess'].includes(key))) return { code: 'INVALID_MESSAGE', message: 'El payload contiene campos desconocidos.', recoverable: true };
  return { protocolVersion: PROTOCOL_VERSION, commandId: value.commandId, idempotencyKey: typeof value.idempotencyKey === 'string' ? value.idempotencyKey : undefined, type: value.type as CommandType, payload: payload as CommandPayload };
}

export function errorResponse(commandId: string, stateVersion: number, error: OnlineError): OnlineResponse { return { protocolVersion: PROTOCOL_VERSION, commandId, accepted: false, stateVersion, error }; }
