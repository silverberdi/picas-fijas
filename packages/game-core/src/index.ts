export type ModeId = 'classic' | 'bot-duel' | 'bot-race' | 'human-duel' | 'human-race';
export interface GameMode { id: ModeId; label: string; description: string; }
export const MODES: readonly GameMode[] = [
  { id: 'classic', label: 'Individual clásico', description: 'Descubre el secreto a tu ritmo.' },
  { id: 'bot-duel', label: 'Duelo máquina', description: 'Turnos alternos contra La máquina.' },
  { id: 'bot-race', label: 'Carrera máquina', description: 'Compite por resolver primero.' },
  { id: 'human-duel', label: 'Duelo humano 1v1', description: 'Un duelo amistoso con otra persona.' },
  { id: 'human-race', label: 'Carrera humana 1v1', description: 'Dos personas, un secreto común.' }
];
export interface Level { id: string; label: string; length: number; repeats: boolean; maxAttempts: number | null; }
export const LEVELS: readonly Level[] = [
  { id: 'beginner', label: 'Principiante', length: 3, repeats: false, maxAttempts: null },
  { id: 'classic', label: 'Clásico', length: 4, repeats: false, maxAttempts: null },
  { id: 'intermediate', label: 'Intermedio', length: 4, repeats: true, maxAttempts: null },
  { id: 'advanced', label: 'Avanzado', length: 5, repeats: false, maxAttempts: 20 },
  { id: 'expert', label: 'Experto', length: 5, repeats: true, maxAttempts: 15 },
  { id: 'master', label: 'Maestro', length: 6, repeats: true, maxAttempts: 12 }
];
export interface CustomLevel { length: number; repeats: boolean; maxAttempts: number | null; }
export function isValidCustomLevel(value: CustomLevel): boolean {
  return Number.isInteger(value.length) && value.length >= 3 && value.length <= 6 && (value.maxAttempts === null || (Number.isInteger(value.maxAttempts) && value.maxAttempts >= 1 && value.maxAttempts <= 100));
}

export interface GameConfig extends CustomLevel { raceDurationSeconds: number; turnDurationSeconds: number; }
export const DEFAULT_RACE_DURATION_SECONDS = 180;
export const DEFAULT_TURN_DURATION_SECONDS = 60;
export type ConfigInput = CustomLevel & Partial<Pick<GameConfig, 'raceDurationSeconds' | 'turnDurationSeconds'>>;
export function isValidConfig(value: ConfigInput): boolean {
  return isValidCustomLevel(value) && Number.isFinite(value.raceDurationSeconds ?? DEFAULT_RACE_DURATION_SECONDS) && (value.raceDurationSeconds ?? DEFAULT_RACE_DURATION_SECONDS) >= 0 && Number.isFinite(value.turnDurationSeconds ?? DEFAULT_TURN_DURATION_SECONDS) && (value.turnDurationSeconds ?? DEFAULT_TURN_DURATION_SECONDS) >= 0;
}
export function createConfig(value: ConfigInput): GameConfig {
  if (!isValidConfig(value)) throw new Error('Configuración inválida');
  return { length: value.length, repeats: value.repeats, maxAttempts: value.maxAttempts, raceDurationSeconds: value.raceDurationSeconds ?? DEFAULT_RACE_DURATION_SECONDS, turnDurationSeconds: value.turnDurationSeconds ?? DEFAULT_TURN_DURATION_SECONDS };
}
export function configFromLevel(level: Level | CustomLevel): GameConfig { return createConfig(level); }

export interface SerializableError { code: string; message: string; field?: string; }
export interface ValidationResult { valid: boolean; error?: SerializableError; normalized?: string; }
export type Secret = string;
export type Guess = string;
export interface Score { fixed: number; picas: number; guess: string; exact: boolean; }
export interface Attempt { guess: string; at: number; score: Score; }
export type FinalReason = 'correct' | 'exhausted' | 'expired' | 'abandoned' | 'technical-interruption' | 'draw';
export type IndividualOutcome = 'win' | 'loss' | 'draw' | 'abandoned' | 'technical-interruption';
export interface IndividualResult { outcome: IndividualOutcome; reason: FinalReason; attempts: number; at: number; }
export interface IndividualState { kind: 'individual'; config: GameConfig; secret: Secret; startedAt: number; lastTimestamp: number; deadline: number | null; attemptsUsed: number; history: Attempt[]; finished: boolean; result?: IndividualResult; }
export interface Transition<T> { state: T; error?: SerializableError; attempt?: Attempt; }

export type IndexSource = (exclusiveUpperBound: number) => number;
export interface RandomIndexSource { nextIndex(exclusiveUpperBound: number): number; }
function nextIndex(source: IndexSource | RandomIndexSource, upper: number): number { const value = typeof source === 'function' ? source(upper) : source.nextIndex(upper); if (!Number.isInteger(value) || value < 0 || value >= upper) throw new Error('La fuente devolvió un índice fuera de rango'); return value; }
export function generateSecret(config: GameConfig | CustomLevel, source: IndexSource | RandomIndexSource): Secret {
  const full = createConfig(config); const available = Array.from({ length: 10 }, (_, digit) => String(digit)); let result = '';
  for (let position = 0; position < full.length; position += 1) { const index = nextIndex(source, full.repeats ? 10 : available.length); result += full.repeats ? String(index) : available.splice(index, 1)[0]; }
  return result;
}
export function seededIndexSource(seed: number): IndexSource { let state = (seed >>> 0) || 0x6d2b79f5; return (upper) => { state = Math.imul(state ^ state >>> 15, 1 | state); state ^= state + Math.imul(state ^ state >>> 7, 61 | state); const unit = ((state ^ state >>> 14) >>> 0) / 4294967296; return Math.floor(unit * upper); }; }

export function validateSecret(value: string, config: GameConfig | CustomLevel): ValidationResult {
  const full = createConfig(config); if (typeof value !== 'string' || value.length !== full.length) return { valid: false, error: { code: 'INVALID_LENGTH', message: 'La tentativa debe tener la longitud configurada.', field: 'guess' } };
  if (!/^\d+$/.test(value)) return { valid: false, error: { code: 'INVALID_DIGITS', message: 'La tentativa sólo puede contener dígitos.', field: 'guess' } };
  if (!full.repeats && new Set(value).size !== value.length) return { valid: false, error: { code: 'REPEATED_DIGIT', message: 'La configuración no permite dígitos repetidos.', field: 'guess' } };
  return { valid: true, normalized: value };
}
export const validateGuess = validateSecret;
export function scoreGuess(secret: Secret, guess: Guess): Score { let fixed = 0; const remainingSecret: string[] = []; const remainingGuess: string[] = []; for (let i = 0; i < secret.length; i += 1) { if (secret[i] === guess[i]) fixed += 1; else { remainingSecret.push(secret[i]); remainingGuess.push(guess[i]); } } const frequencies = new Map<string, number>(); for (const digit of remainingSecret) frequencies.set(digit, (frequencies.get(digit) ?? 0) + 1); let picas = 0; for (const digit of remainingGuess) { const count = frequencies.get(digit) ?? 0; if (count > 0) { picas += 1; frequencies.set(digit, count - 1); } } return { fixed, picas, guess, exact: fixed === secret.length }; }
export const evaluateScore = scoreGuess;
export function evaluateAttempt(secret: Secret, guess: Guess, config: GameConfig | CustomLevel): Score | SerializableError { const validation = validateSecret(guess, config); return validation.valid ? scoreGuess(secret, validation.normalized!) : validation.error!; }

function makeError(code: string, message: string): SerializableError { return { code, message }; }
export function createIndividualState(config: GameConfig | CustomLevel, secret: Secret, startedAt = 0): IndividualState { const full = createConfig(config); if (!validateSecret(secret, full).valid) throw new Error('Secreto inválido'); return { kind: 'individual', config: full, secret, startedAt, lastTimestamp: startedAt, deadline: null, attemptsUsed: 0, history: [], finished: false }; }
export const startIndividual = createIndividualState;
function finishIndividual(state: IndividualState, reason: 'expired' | 'abandoned' | 'technical-interruption', at: number): Transition<IndividualState> { return { state: { ...state, finished: true, result: { outcome: reason === 'expired' ? 'loss' : reason, reason, attempts: state.attemptsUsed, at } } }; }
export function submitIndividualAttempt(state: IndividualState, guess: Guess, now: number): Transition<IndividualState> { if (state.finished) return { state, error: makeError('GAME_FINISHED', 'La partida ya terminó.') }; if (now < state.lastTimestamp) return { state, error: makeError('CLOCK_REWIND', 'El reloj monotónico no puede retroceder.') }; const validation = validateSecret(guess, state.config); if (!validation.valid) return { state: { ...state, lastTimestamp: now }, error: validation.error }; const scored = scoreGuess(state.secret, guess); const attempt = { guess, at: now, score: scored }; const history = [...state.history, attempt]; const attemptsUsed = state.attemptsUsed + 1; if (scored.exact) return { state: { ...state, lastTimestamp: now, history, attemptsUsed, finished: true, result: { outcome: 'win', reason: 'correct', attempts: attemptsUsed, at: now } }, attempt }; if (state.config.maxAttempts !== null && attemptsUsed >= state.config.maxAttempts) return { state: { ...state, lastTimestamp: now, history, attemptsUsed, finished: true, result: { outcome: 'loss', reason: 'exhausted', attempts: attemptsUsed, at: now } }, attempt }; return { state: { ...state, lastTimestamp: now, history, attemptsUsed }, attempt }; }
export const expireIndividual = (state: IndividualState, now: number) => finishIndividual(state, 'expired', now);
export const abandonIndividual = (state: IndividualState, now: number) => finishIndividual(state, 'abandoned', now);
export const interruptIndividual = (state: IndividualState, now: number) => finishIndividual(state, 'technical-interruption', now);

export interface PlayerResult { player: string; outcome: IndividualOutcome; reason: FinalReason; attempts: number; }
export interface DuelState { kind: 'duel'; config: GameConfig; secrets: Record<string, Secret>; startedAt: number; lastTimestamp: number; round: number; currentPlayer: string; attempts: Record<string, number>; histories: Record<string, Attempt[]>; finished: boolean; result?: { outcome: 'win' | 'draw'; reason: FinalReason; winner?: string; at?: number; players: PlayerResult[] }; }
export function createDuelState(config: GameConfig | CustomLevel, secrets: Record<string, Secret>, startedAt = 0): DuelState { const players = Object.keys(secrets); if (players.length !== 2) throw new Error('Un duelo requiere dos jugadores'); const full = createConfig(config); for (const player of players) if (!validateSecret(secrets[player], full).valid) throw new Error('Secreto inválido'); return { kind: 'duel', config: full, secrets: { ...secrets }, startedAt, lastTimestamp: startedAt, round: 1, currentPlayer: players[0], attempts: Object.fromEntries(players.map(p => [p, 0])), histories: Object.fromEntries(players.map(p => [p, []])), finished: false }; }
export function submitDuelAttempt(state: DuelState, player: string, guess: Guess, now: number): Transition<DuelState> { if (state.finished) return { state, error: makeError('GAME_FINISHED', 'El duelo ya terminó.') }; if (now < state.lastTimestamp) return { state, error: makeError('CLOCK_REWIND', 'El reloj monotónico no puede retroceder.') }; if (!(player in state.secrets) || player !== state.currentPlayer) return { state: { ...state, lastTimestamp: now }, error: makeError('NOT_YOUR_TURN', 'No es el turno de ese jugador.') }; const prior = state.histories[player]; const turnStart = prior.length ? prior[prior.length - 1].at : state.startedAt; if (now >= turnStart + state.config.turnDurationSeconds) return { state: { ...state, lastTimestamp: now, finished: true, result: { outcome: 'draw', reason: 'expired', at: now, players: Object.keys(state.secrets).map(p => ({ player: p, outcome: 'draw', reason: 'expired', attempts: state.attempts[p] })) } } }; const validation = validateSecret(guess, state.config); if (!validation.valid) return { state: { ...state, lastTimestamp: now }, error: validation.error }; const attempt = { guess, at: now, score: scoreGuess(state.secrets[player], guess) }; const histories = { ...state.histories, [player]: [...prior, attempt] }; const attempts = { ...state.attempts, [player]: state.attempts[player] + 1 }; const players = Object.keys(state.secrets); const other = players.find(p => p !== player)!; const current = { ...state, lastTimestamp: now, histories, attempts }; const otherSolved = histories[other].some(a => a.score.exact); if (attempt.score.exact) { if (otherSolved) return { state: finishDuelState(current, 'draw', 'correct', undefined, now), attempt }; return { state: { ...current, currentPlayer: other }, attempt }; } if (otherSolved) return { state: finishDuelState(current, 'win', 'correct', other, now), attempt }; if (state.config.maxAttempts !== null && attempts[player] >= state.config.maxAttempts && attempts[other] >= state.config.maxAttempts) return { state: finishDuelState(current, 'draw', 'exhausted', undefined, now), attempt }; return { state: { ...current, currentPlayer: other, round: player === players[1] ? state.round + 1 : state.round }, attempt }; }
function finishDuelState(state: DuelState, outcome: 'win' | 'draw', reason: FinalReason, winner?: string, at?: number): DuelState { const players = Object.keys(state.secrets).map(player => ({ player, outcome: outcome === 'draw' ? 'draw' : player === winner ? 'win' : 'loss', reason, attempts: state.attempts[player] } as PlayerResult)); return { ...state, finished: true, result: { outcome, reason, winner, at, players } }; }

export interface RaceState { kind: 'race'; config: GameConfig; secret: Secret; startedAt: number; lastTimestamp: number; deadline: number; attempts: Record<string, number>; history: Array<Attempt & { player: string }>; finished: boolean; result?: { outcome: 'win' | 'draw'; reason: FinalReason; winner?: string; at?: number }; }
export function createRaceState(config: GameConfig | CustomLevel, secret: Secret, startedAt = 0): RaceState { const full = createConfig(config); if (!validateSecret(secret, full).valid) throw new Error('Secreto inválido'); return { kind: 'race', config: full, secret, startedAt, lastTimestamp: startedAt, deadline: startedAt + full.raceDurationSeconds, attempts: {}, history: [], finished: false }; }
export function expireRace(state: RaceState, now: number): RaceState { if (state.finished || now < state.lastTimestamp || now < state.deadline) return state; return { ...state, lastTimestamp: now, finished: true, result: { outcome: 'draw', reason: 'expired', at: now } }; }
export function submitRaceAttempt(state: RaceState, player: string, guess: Guess, now: number): Transition<RaceState> { if (state.finished) return { state, error: makeError('GAME_FINISHED', 'La carrera ya terminó.') }; if (now < state.lastTimestamp) return { state, error: makeError('CLOCK_REWIND', 'El reloj monotónico no puede retroceder.') }; if (now >= state.deadline) return { state: { ...state, lastTimestamp: now, finished: true, result: { outcome: 'draw', reason: 'expired', at: now } } }; const validation = validateSecret(guess, state.config); if (!validation.valid) return { state: { ...state, lastTimestamp: now }, error: validation.error }; const attempt = { player, guess, at: now, score: scoreGuess(state.secret, guess) }; const next = { ...state, lastTimestamp: now, attempts: { ...state.attempts, [player]: (state.attempts[player] ?? 0) + 1 }, history: [...state.history, attempt] }; return attempt.score.exact ? { state: { ...next, finished: true, result: { outcome: 'win', reason: 'correct', winner: player, at: now } }, attempt } : { state: next, attempt }; }
export const submitRaceGuess = submitRaceAttempt;
export interface MonotonicClock { now(): number; }
export function createMonotonicClock(read: () => number): MonotonicClock { let last = -Infinity; return { now: () => { const value = read(); if (value < last) throw new Error('CLOCK_REWIND'); last = value; return value; } }; }
export function serialize<T>(value: T): string { return JSON.stringify(value); }
export function deserialize<T>(value: string): T { return JSON.parse(value) as T; }
