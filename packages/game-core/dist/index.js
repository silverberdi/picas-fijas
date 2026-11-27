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
export function createMachineConfig(kind, difficulty, seed) {
    if (!Number.isInteger(seed))
        throw new Error('La semilla debe ser entera');
    return { kind, difficulty, seed: seed >>> 0, calculation: 'idle' };
}
function candidateValues(config, limit, source) {
    const values = [];
    for (let i = 0; i < limit; i += 1)
        values.push(generateSecret(config, source));
    return values;
}
function compatible(candidate, history, config) {
    return history.every((attempt) => {
        const score = scoreGuess(candidate, attempt.guess);
        return score.fixed === attempt.score.fixed && score.picas === attempt.score.picas && validateSecret(candidate, config).valid;
    });
}
/** Pure easy policy: a deterministic probe derived only from public history and rules. */
export function chooseEasyGuess(input) {
    const source = seededIndexSource(input.seed + input.history.length * 31);
    const guesses = candidateValues(input.config, 32, source);
    const guess = guesses.find((value) => !input.history.some((entry) => entry.guess === value)) ?? guesses[0];
    return { guess, difficulty: 'easy', seed: input.seed >>> 0, work: guesses.length, latencyMs: 18 + (input.seed % 7) };
}
/** Intermediate policy filters candidates against the machine's own scored history. */
export function chooseIntermediateGuess(input) {
    const source = seededIndexSource(input.seed ^ 0x9e3779b9);
    const guesses = candidateValues(input.config, 192, source);
    const compatibleCandidates = guesses.filter((value) => compatible(value, input.history, input.config));
    const pool = compatibleCandidates.length ? compatibleCandidates : guesses;
    const guess = pool.find((value) => !input.history.some((entry) => entry.guess === value)) ?? pool[0];
    return { guess, difficulty: 'intermediate', seed: input.seed >>> 0, work: guesses.length, latencyMs: 36 + (input.seed % 11) };
}
/** Hard policy samples a bounded candidate set and chooses the most informative probe. */
export function chooseHardGuess(input) {
    const source = seededIndexSource(input.seed ^ 0x85ebca6b);
    const guesses = candidateValues(input.config, input.config.length === 6 ? 128 : 160, source);
    const candidates = guesses.filter((value) => compatible(value, input.history, input.config));
    const pool = candidates.length ? candidates : guesses;
    // Keep the hard policy bounded and responsive for the six-digit configuration.
    // The previous sort recalculated every history score for every comparator call,
    // making the calculation unnecessarily expensive in the browser.
    const seen = new Set(input.history.map((entry) => entry.guess));
    let guess = pool[0];
    let bestBuckets = -1;
    for (const candidate of pool) {
        if (seen.has(candidate))
            continue;
        const buckets = new Set(input.history.map((entry) => {
            const score = scoreGuess(candidate, entry.guess);
            return `${score.fixed}:${score.picas}`;
        })).size;
        if (buckets > bestBuckets || (buckets === bestBuckets && candidate.localeCompare(guess) < 0)) {
            guess = candidate;
            bestBuckets = buckets;
        }
    }
    return { guess, difficulty: 'hard', seed: input.seed >>> 0, work: guesses.length, latencyMs: 52 + (input.seed % 17) };
}
export function chooseMachineGuess(input) {
    if (input.difficulty === 'easy')
        return chooseEasyGuess(input);
    if (input.difficulty === 'intermediate')
        return chooseIntermediateGuess(input);
    return chooseHardGuess(input);
}
export function calculateMachineGuess(input, options = {}) {
    options.onProgress?.({ status: 'calculating', progress: 0 });
    return new Promise((resolve, reject) => {
        let timer;
        timer = setTimeout(() => {
            if (options.signal?.aborted)
                return;
            const decision = chooseMachineGuess(input);
            timer = setTimeout(() => {
                if (options.signal?.aborted)
                    return;
                options.onProgress?.({ status: 'complete', progress: 1, decision });
                resolve(decision);
            }, options.delayMs ?? decision.latencyMs);
        }, 0);
        options.signal?.addEventListener('abort', () => { clearTimeout(timer); options.onProgress?.({ status: 'cancelled', progress: 0 }); reject(new DOMException('Cálculo cancelado', 'AbortError')); }, { once: true });
    });
}
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
export function createDuelState(config, secrets, startedAt = 0, machine) { const players = Object.keys(secrets); if (players.length !== 2)
    throw new Error('Un duelo requiere dos jugadores'); const full = createConfig(config); for (const player of players)
    if (!validateSecret(secrets[player], full).valid)
        throw new Error('Secreto inválido'); return { kind: 'duel', config: full, secrets: { ...secrets }, startedAt, lastTimestamp: startedAt, round: 1, currentPlayer: players[0], attempts: Object.fromEntries(players.map(p => [p, 0])), histories: Object.fromEntries(players.map(p => [p, []])), finished: false, ...(machine ? { machine } : {}) }; }
export function submitDuelAttempt(state, player, guess, now) { if (state.finished)
    return { state, error: makeError('GAME_FINISHED', 'El duelo ya terminó.') }; if (now < state.lastTimestamp)
    return { state, error: makeError('CLOCK_REWIND', 'El reloj monotónico no puede retroceder.') }; if (!(player in state.secrets) || player !== state.currentPlayer)
    return { state, error: makeError('NOT_YOUR_TURN', 'No es el turno de ese jugador.') }; const prior = state.histories[player]; const turnStart = prior.length ? prior[prior.length - 1].at : state.startedAt; if (now >= turnStart + state.config.turnDurationSeconds * 1000)
    return { state: { ...state, lastTimestamp: now, finished: true, result: { outcome: 'draw', reason: 'expired', at: now, players: Object.keys(state.secrets).map(p => ({ player: p, outcome: 'draw', reason: 'expired', attempts: state.attempts[p] })) } } }; const validation = validateSecret(guess, state.config); if (!validation.valid)
    return { state, error: validation.error }; const attempt = { guess, at: now, score: scoreGuess(state.secrets[player], guess) }; const histories = { ...state.histories, [player]: [...prior, attempt] }; const attempts = { ...state.attempts, [player]: state.attempts[player] + 1 }; const players = Object.keys(state.secrets); const other = players.find(p => p !== player); const current = { ...state, lastTimestamp: now, histories, attempts }; const otherSolved = histories[other].some(a => a.score.exact); if (attempt.score.exact) {
    if (otherSolved)
        return { state: finishDuelState(current, 'draw', 'correct', undefined, now), attempt };
    return { state: { ...current, currentPlayer: other }, attempt };
} if (otherSolved)
    return { state: finishDuelState(current, 'win', 'correct', other, now), attempt }; if (state.config.maxAttempts !== null && attempts[player] >= state.config.maxAttempts && attempts[other] >= state.config.maxAttempts)
    return { state: finishDuelState(current, 'draw', 'exhausted', undefined, now), attempt }; return { state: { ...current, currentPlayer: other, round: player === players[1] ? state.round + 1 : state.round }, attempt }; }
function finishDuelState(state, outcome, reason, winner, at) { const players = Object.keys(state.secrets).map(player => ({ player, outcome: outcome === 'draw' ? 'draw' : player === winner ? 'win' : 'loss', reason, attempts: state.attempts[player] })); return { ...state, finished: true, result: { outcome, reason, winner, at, players } }; }
export function createRaceState(config, secret, startedAt = 0, machine) { const full = createConfig(config); if (!validateSecret(secret, full).valid)
    throw new Error('Secreto inválido'); return { kind: 'race', config: full, secret, startedAt, lastTimestamp: startedAt, deadline: startedAt + full.raceDurationSeconds * 1000, attempts: {}, history: [], finished: false, ...(machine ? { machine } : {}) }; }
export function expireRace(state, now) { if (state.finished || now < state.lastTimestamp || now < state.deadline)
    return state; return { ...state, lastTimestamp: now, finished: true, result: { outcome: 'draw', reason: 'expired', at: now } }; }
export function submitRaceAttempt(state, player, guess, now) { if (state.finished)
    return { state, error: makeError('GAME_FINISHED', 'La carrera ya terminó.') }; if (now < state.lastTimestamp)
    return { state, error: makeError('CLOCK_REWIND', 'El reloj monotónico no puede retroceder.') }; if (now >= state.deadline)
    return { state: { ...state, lastTimestamp: now, finished: true, result: { outcome: 'draw', reason: 'expired', at: now } } }; const validation = validateSecret(guess, state.config); if (!validation.valid)
    return { state, error: validation.error }; const attempt = { player, guess, at: now, score: scoreGuess(state.secret, guess) }; const next = { ...state, lastTimestamp: now, attempts: { ...state.attempts, [player]: (state.attempts[player] ?? 0) + 1 }, history: [...state.history, attempt] }; if (attempt.score.exact)
    return { state: { ...next, finished: true, result: { outcome: 'win', reason: 'correct', winner: player, at: now } }, attempt }; const maxAttempts = state.config.maxAttempts; const bothPlayersExhausted = maxAttempts !== null && Object.values(next.attempts).length >= 2 && Object.values(next.attempts).every((value) => value >= maxAttempts); return bothPlayersExhausted ? { state: { ...next, finished: true, result: { outcome: 'draw', reason: 'exhausted', at: now } }, attempt } : { state: next, attempt }; }
export const submitRaceGuess = submitRaceAttempt;
export function createParticipantSnapshot(state, participant) {
    if (state.kind === 'duel') {
        if (!(participant in state.histories))
            throw new Error('Participante desconocido');
        return { kind: 'duel', config: state.config, machine: state.machine, history: state.histories[participant].map((attempt) => ({ ...attempt })), attemptsUsed: state.attempts[participant], finished: state.finished, result: state.finished ? state.result : undefined, currentPlayer: state.currentPlayer };
    }
    return { kind: 'race', config: state.config, machine: state.machine, history: state.finished ? state.history.map((attempt) => ({ ...attempt })) : [], attemptsUsed: state.attempts[participant] ?? 0, finished: state.finished, result: state.finished ? state.result : undefined, deadline: state.deadline };
}
export function serializeParticipantSnapshot(state, participant) {
    const snapshot = createParticipantSnapshot(state, participant);
    return serialize(snapshot);
}
export function simulateMachine(config, difficulty, seed, secret) {
    let history = [];
    let resolved = false;
    let latencyMs = 0;
    for (let attempt = 0; attempt < (config.maxAttempts ?? 12); attempt += 1) {
        const decision = chooseMachineGuess({ config, history, seed: seed + attempt, difficulty });
        latencyMs += decision.latencyMs;
        const validation = validateSecret(decision.guess, config);
        if (!validation.valid)
            continue;
        const scored = scoreGuess(secret, decision.guess);
        history = [...history, { guess: decision.guess, at: attempt, score: scored }];
        if (scored.exact) {
            resolved = true;
            return { seed: seed >>> 0, difficulty, length: config.length, repeats: config.repeats, latencyMs, resolved, attempts: history.length };
        }
    }
    return { seed: seed >>> 0, difficulty, length: config.length, repeats: config.repeats, latencyMs, resolved, attempts: history.length };
}
export function createMonotonicClock(read) { let last = -Infinity; return { now: () => { const value = read(); if (value < last)
        throw new Error('CLOCK_REWIND'); last = value; return value; } }; }
export function unifiedResult(outcome, reason, at, options = {}) { return { outcome, reason, at, ...options }; }
export const DEFAULT_RECONNECTION_GRACE_MS = 60_000;
export function createReconnectionState(ids, now = 0, graceMs = DEFAULT_RECONNECTION_GRACE_MS) {
    if (!ids.length || new Set(ids).size !== ids.length || graceMs < 0)
        throw new Error('Participantes o gracia inválidos');
    return { participants: Object.fromEntries(ids.map((id) => [id, { id, connected: true }])), graceMs, paused: false, startedAt: now, finished: false, lastTimestamp: now };
}
function finishReconnection(state, outcome, reason, at, winner) {
    const affected = Object.keys(state.participants).filter((id) => !state.participants[id].connected);
    return { ...state, paused: false, finished: true, lastTimestamp: at, result: winner === undefined ? unifiedResult(outcome, reason, at, { affected }) : unifiedResult(outcome, reason, at, { winner, affected }) };
}
export function disconnectParticipant(state, id, now) {
    const participant = state.participants[id];
    if (!participant)
        return { state, error: makeError('UNKNOWN_PARTICIPANT', 'Participante desconocido.') };
    if (state.finished || !participant.connected)
        return { state };
    const participants = { ...state.participants, [id]: { ...participant, connected: false, disconnectedAt: now } };
    return { state: { ...state, participants, paused: true, lastTimestamp: Math.max(state.lastTimestamp, now), expiresAt: now + state.graceMs } };
}
export function reconnectParticipant(state, id, now) {
    const participant = state.participants[id];
    if (!participant)
        return { state, error: makeError('UNKNOWN_PARTICIPANT', 'Participante desconocido.') };
    if (state.finished)
        return { state, error: makeError('GAME_FINISHED', 'La partida ya terminó.') };
    if (participant.connected)
        return { state };
    if (participant.disconnectedAt === undefined || now - participant.disconnectedAt >= state.graceMs)
        return { state: expireReconnectionGrace(state, now), error: makeError('GRACE_EXPIRED', 'La gracia de reconexión expiró.') };
    const participants = { ...state.participants, [id]: { id, connected: true } };
    return { state: { ...state, participants, paused: Object.values(participants).some((entry) => !entry.connected), expiresAt: undefined, lastTimestamp: Math.max(state.lastTimestamp, now) } };
}
export function expireReconnectionGrace(state, now) {
    if (state.finished || !state.paused || !Object.values(state.participants).some((entry) => !entry.connected))
        return state;
    const expired = Object.values(state.participants).some((entry) => entry.disconnectedAt !== undefined && now - entry.disconnectedAt >= state.graceMs);
    if (!expired)
        return state;
    const connected = Object.values(state.participants).filter((entry) => entry.connected);
    return connected.length === 1 ? finishReconnection(state, 'abandono', 'grace-expired', now, connected[0].id) : finishReconnection(state, 'interrupción', 'technical-interruption', now);
}
export function restartReconnection(state, now) { return state.finished ? state : finishReconnection(state, 'interrupción', 'restart', now); }
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
