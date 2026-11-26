export const MODES = [
    { id: 'classic', label: 'Individual clásico', description: 'Descubre el secreto a tu ritmo.' },
    { id: 'bot-duel', label: 'Duelo máquina', description: 'Turnos alternos contra La máquina.' },
    { id: 'bot-race', label: 'Carrera máquina', description: 'Compite por resolver primero.' },
    { id: 'human-duel', label: 'Duelo humano 1v1', description: 'Un duelo amistoso con otra persona.' },
    { id: 'human-race', label: 'Carrera humana 1v1', description: 'Dos personas, un secreto común.' }
];
export const LEVELS = [
    { id: 'beginner', label: 'Principiante', length: 3, repeats: false, maxAttempts: null },
    { id: 'classic', label: 'Clásico', length: 4, repeats: false, maxAttempts: null },
    { id: 'intermediate', label: 'Intermedio', length: 4, repeats: true, maxAttempts: null },
    { id: 'advanced', label: 'Avanzado', length: 5, repeats: false, maxAttempts: 20 },
    { id: 'expert', label: 'Experto', length: 5, repeats: true, maxAttempts: 15 },
    { id: 'master', label: 'Maestro', length: 6, repeats: true, maxAttempts: 12 }
];
export function isValidCustomLevel(value) {
    return Number.isInteger(value.length) && value.length >= 3 && value.length <= 6 && (value.maxAttempts === null || (Number.isInteger(value.maxAttempts) && value.maxAttempts >= 1 && value.maxAttempts <= 100));
}
export const DEFAULT_RACE_DURATION_SECONDS = 180;
export const DEFAULT_TURN_DURATION_SECONDS = 60;
export function isValidConfig(value) {
    return isValidCustomLevel(value) && Number.isFinite(value.raceDurationSeconds ?? DEFAULT_RACE_DURATION_SECONDS) && (value.raceDurationSeconds ?? DEFAULT_RACE_DURATION_SECONDS) >= 0 && Number.isFinite(value.turnDurationSeconds ?? DEFAULT_TURN_DURATION_SECONDS) && (value.turnDurationSeconds ?? DEFAULT_TURN_DURATION_SECONDS) >= 0;
}
export function createConfig(value) {
    if (!isValidConfig(value))
        throw new Error('Configuración inválida');
    return { length: value.length, repeats: value.repeats, maxAttempts: value.maxAttempts, raceDurationSeconds: value.raceDurationSeconds ?? DEFAULT_RACE_DURATION_SECONDS, turnDurationSeconds: value.turnDurationSeconds ?? DEFAULT_TURN_DURATION_SECONDS };
}
export function configFromLevel(level) { return createConfig(level); }
function nextIndex(source, upper) { const value = typeof source === 'function' ? source(upper) : source.nextIndex(upper); if (!Number.isInteger(value) || value < 0 || value >= upper)
    throw new Error('La fuente devolvió un índice fuera de rango'); return value; }
export function generateSecret(config, source) {
    const full = createConfig(config);
    const available = Array.from({ length: 10 }, (_, digit) => String(digit));
    let result = '';
    for (let position = 0; position < full.length; position += 1) {
        const index = nextIndex(source, full.repeats ? 10 : available.length);
        result += full.repeats ? String(index) : available.splice(index, 1)[0];
    }
    return result;
}
export function seededIndexSource(seed) { let state = (seed >>> 0) || 0x6d2b79f5; return (upper) => { state = Math.imul(state ^ state >>> 15, 1 | state); state ^= state + Math.imul(state ^ state >>> 7, 61 | state); const unit = ((state ^ state >>> 14) >>> 0) / 4294967296; return Math.floor(unit * upper); }; }
export function validateSecret(value, config) {
    const full = createConfig(config);
    if (typeof value !== 'string' || value.length !== full.length)
        return { valid: false, error: { code: 'INVALID_LENGTH', message: 'La tentativa debe tener la longitud configurada.', field: 'guess' } };
    if (!/^\d+$/.test(value))
        return { valid: false, error: { code: 'INVALID_DIGITS', message: 'La tentativa sólo puede contener dígitos.', field: 'guess' } };
    if (!full.repeats && new Set(value).size !== value.length)
        return { valid: false, error: { code: 'REPEATED_DIGIT', message: 'La configuración no permite dígitos repetidos.', field: 'guess' } };
    return { valid: true, normalized: value };
}
export const validateGuess = validateSecret;
export function scoreGuess(secret, guess) { let fixed = 0; const remainingSecret = []; const remainingGuess = []; for (let i = 0; i < secret.length; i += 1) {
    if (secret[i] === guess[i])
        fixed += 1;
    else {
        remainingSecret.push(secret[i]);
        remainingGuess.push(guess[i]);
    }
} const frequencies = new Map(); for (const digit of remainingSecret)
    frequencies.set(digit, (frequencies.get(digit) ?? 0) + 1); let picas = 0; for (const digit of remainingGuess) {
    const count = frequencies.get(digit) ?? 0;
    if (count > 0) {
        picas += 1;
        frequencies.set(digit, count - 1);
    }
} return { fixed, picas, guess, exact: fixed === secret.length }; }
export const evaluateScore = scoreGuess;
export function evaluateAttempt(secret, guess, config) { const validation = validateSecret(guess, config); return validation.valid ? scoreGuess(secret, validation.normalized) : validation.error; }
function makeError(code, message) { return { code, message }; }
export function createIndividualState(config, secret, startedAt = 0) { const full = createConfig(config); if (!validateSecret(secret, full).valid)
    throw new Error('Secreto inválido'); return { kind: 'individual', config: full, secret, startedAt, lastTimestamp: startedAt, deadline: null, attemptsUsed: 0, history: [], finished: false }; }
export const startIndividual = createIndividualState;
function finishIndividual(state, reason, at) { return { state: { ...state, finished: true, result: { outcome: reason === 'expired' ? 'loss' : reason, reason, attempts: state.attemptsUsed, at } } }; }
export function submitIndividualAttempt(state, guess, now) { if (state.finished)
    return { state, error: makeError('GAME_FINISHED', 'La partida ya terminó.') }; if (now < state.lastTimestamp)
    return { state, error: makeError('CLOCK_REWIND', 'El reloj monotónico no puede retroceder.') }; const validation = validateSecret(guess, state.config); if (!validation.valid)
    return { state, error: validation.error }; const scored = scoreGuess(state.secret, guess); const attempt = { guess, at: now, score: scored }; const history = [...state.history, attempt]; const attemptsUsed = state.attemptsUsed + 1; if (scored.exact)
    return { state: { ...state, lastTimestamp: now, history, attemptsUsed, finished: true, result: { outcome: 'win', reason: 'correct', attempts: attemptsUsed, at: now } }, attempt }; if (state.config.maxAttempts !== null && attemptsUsed >= state.config.maxAttempts)
    return { state: { ...state, lastTimestamp: now, history, attemptsUsed, finished: true, result: { outcome: 'loss', reason: 'exhausted', attempts: attemptsUsed, at: now } }, attempt }; return { state: { ...state, lastTimestamp: now, history, attemptsUsed }, attempt }; }
export const expireIndividual = (state, now) => finishIndividual(state, 'expired', now);
export const abandonIndividual = (state, now) => finishIndividual(state, 'abandoned', now);
export const interruptIndividual = (state, now) => finishIndividual(state, 'technical-interruption', now);
export function createDuelState(config, secrets, startedAt = 0) { const players = Object.keys(secrets); if (players.length !== 2)
    throw new Error('Un duelo requiere dos jugadores'); const full = createConfig(config); for (const player of players)
    if (!validateSecret(secrets[player], full).valid)
        throw new Error('Secreto inválido'); return { kind: 'duel', config: full, secrets: { ...secrets }, startedAt, lastTimestamp: startedAt, round: 1, currentPlayer: players[0], attempts: Object.fromEntries(players.map(p => [p, 0])), histories: Object.fromEntries(players.map(p => [p, []])), finished: false }; }
export function submitDuelAttempt(state, player, guess, now) { if (state.finished)
    return { state, error: makeError('GAME_FINISHED', 'El duelo ya terminó.') }; if (now < state.lastTimestamp)
    return { state, error: makeError('CLOCK_REWIND', 'El reloj monotónico no puede retroceder.') }; if (!(player in state.secrets) || player !== state.currentPlayer)
    return { state, error: makeError('NOT_YOUR_TURN', 'No es el turno de ese jugador.') }; const prior = state.histories[player]; const turnStart = prior.length ? prior[prior.length - 1].at : state.startedAt; if (now >= turnStart + state.config.turnDurationSeconds)
    return { state: { ...state, lastTimestamp: now, finished: true, result: { outcome: 'draw', reason: 'expired', at: now, players: Object.keys(state.secrets).map(p => ({ player: p, outcome: 'draw', reason: 'expired', attempts: state.attempts[p] })) } } }; const validation = validateSecret(guess, state.config); if (!validation.valid)
    return { state, error: validation.error }; const attempt = { guess, at: now, score: scoreGuess(state.secrets[player], guess) }; const histories = { ...state.histories, [player]: [...prior, attempt] }; const attempts = { ...state.attempts, [player]: state.attempts[player] + 1 }; const players = Object.keys(state.secrets); const other = players.find(p => p !== player); const current = { ...state, lastTimestamp: now, histories, attempts }; const otherSolved = histories[other].some(a => a.score.exact); if (attempt.score.exact) {
    if (otherSolved)
        return { state: finishDuelState(current, 'draw', 'correct', undefined, now), attempt };
    return { state: { ...current, currentPlayer: other }, attempt };
} if (otherSolved)
    return { state: finishDuelState(current, 'win', 'correct', other, now), attempt }; if (state.config.maxAttempts !== null && attempts[player] >= state.config.maxAttempts && attempts[other] >= state.config.maxAttempts)
    return { state: finishDuelState(current, 'draw', 'exhausted', undefined, now), attempt }; return { state: { ...current, currentPlayer: other, round: player === players[1] ? state.round + 1 : state.round }, attempt }; }
function finishDuelState(state, outcome, reason, winner, at) { const players = Object.keys(state.secrets).map(player => ({ player, outcome: outcome === 'draw' ? 'draw' : player === winner ? 'win' : 'loss', reason, attempts: state.attempts[player] })); return { ...state, finished: true, result: { outcome, reason, winner, at, players } }; }
export function createRaceState(config, secret, startedAt = 0) { const full = createConfig(config); if (!validateSecret(secret, full).valid)
    throw new Error('Secreto inválido'); return { kind: 'race', config: full, secret, startedAt, lastTimestamp: startedAt, deadline: startedAt + full.raceDurationSeconds, attempts: {}, history: [], finished: false }; }
export function expireRace(state, now) { if (state.finished || now < state.lastTimestamp || now < state.deadline)
    return state; return { ...state, lastTimestamp: now, finished: true, result: { outcome: 'draw', reason: 'expired', at: now } }; }
export function submitRaceAttempt(state, player, guess, now) { if (state.finished)
    return { state, error: makeError('GAME_FINISHED', 'La carrera ya terminó.') }; if (now < state.lastTimestamp)
    return { state, error: makeError('CLOCK_REWIND', 'El reloj monotónico no puede retroceder.') }; if (now >= state.deadline)
    return { state: { ...state, lastTimestamp: now, finished: true, result: { outcome: 'draw', reason: 'expired', at: now } } }; const validation = validateSecret(guess, state.config); if (!validation.valid)
    return { state, error: validation.error }; const attempt = { player, guess, at: now, score: scoreGuess(state.secret, guess) }; const next = { ...state, lastTimestamp: now, attempts: { ...state.attempts, [player]: (state.attempts[player] ?? 0) + 1 }, history: [...state.history, attempt] }; return attempt.score.exact ? { state: { ...next, finished: true, result: { outcome: 'win', reason: 'correct', winner: player, at: now } }, attempt } : { state: next, attempt }; }
export const submitRaceGuess = submitRaceAttempt;
export function createMonotonicClock(read) { let last = -Infinity; return { now: () => { const value = read(); if (value < last)
        throw new Error('CLOCK_REWIND'); last = value; return value; } }; }
export function serialize(value) { return JSON.stringify(value); }
export function deserialize(value) { return JSON.parse(value); }
/**
 * Deliberately accepts only visible configuration and scored history. A secret
 * cannot be passed to this policy accidentally because it is not part of the
 * request type or implementation.
 */
export function getIndividualGuidance(request) {
    if (request.helpsUsed >= 3)
        return { available: false, message: 'Has usado las 3 ayudas disponibles en esta partida.' };
    if (request.history.length === 0)
        return { available: true, message: 'Prueba una combinación válida y usa sus fijas y picas para acotar tus opciones.' };
    const last = request.history[request.history.length - 1];
    if (last.fixed === request.config.length)
        return { available: true, message: 'Tu última tentativa coincide por completo. Confírmala para terminar.' };
    if (last.fixed > 0)
        return { available: true, message: `Conserva las ${last.fixed} posiciones fijas y cambia las demás con calma.` };
    if (last.picas > 0)
        return { available: true, message: `Tienes ${last.picas} picas: esos dígitos están, pero necesitan otra posición.` };
    return { available: true, message: 'Ningún dígito de la última tentativa coincidió; prueba con dígitos nuevos.' };
}
