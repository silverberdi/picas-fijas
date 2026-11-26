export type ModeId = 'classic' | 'bot-duel' | 'bot-race' | 'human-duel' | 'human-race';
export interface GameMode {
    id: ModeId;
    label: string;
    description: string;
}
export declare const MODES: readonly GameMode[];
export interface Level {
    id: string;
    label: string;
    length: number;
    repeats: boolean;
    maxAttempts: number | null;
}
export declare const LEVELS: readonly Level[];
export interface CustomLevel {
    length: number;
    repeats: boolean;
    maxAttempts: number | null;
}
export declare function isValidCustomLevel(value: CustomLevel): boolean;
export interface GameConfig extends CustomLevel {
    raceDurationSeconds: number;
    turnDurationSeconds: number;
}
export declare const DEFAULT_RACE_DURATION_SECONDS = 180;
export declare const DEFAULT_TURN_DURATION_SECONDS = 60;
export type ConfigInput = CustomLevel & Partial<Pick<GameConfig, 'raceDurationSeconds' | 'turnDurationSeconds'>>;
export declare function isValidConfig(value: ConfigInput): boolean;
export declare function createConfig(value: ConfigInput): GameConfig;
export declare function configFromLevel(level: Level | CustomLevel): GameConfig;
export interface SerializableError {
    code: string;
    message: string;
    field?: string;
}
export interface ValidationResult {
    valid: boolean;
    error?: SerializableError;
    normalized?: string;
}
export type Secret = string;
export type Guess = string;
export interface Score {
    fixed: number;
    picas: number;
    guess: string;
    exact: boolean;
}
export interface Attempt {
    guess: string;
    at: number;
    score: Score;
}
export type FinalReason = 'correct' | 'exhausted' | 'expired' | 'abandoned' | 'technical-interruption' | 'draw' | 'resignation' | 'grace-expired' | 'restart';
export type IndividualOutcome = 'win' | 'loss' | 'draw' | 'abandoned' | 'technical-interruption';
export interface IndividualResult {
    outcome: IndividualOutcome;
    reason: FinalReason;
    attempts: number;
    at: number;
}
export interface IndividualState {
    kind: 'individual';
    config: GameConfig;
    secret: Secret;
    startedAt: number;
    lastTimestamp: number;
    deadline: number | null;
    attemptsUsed: number;
    history: Attempt[];
    finished: boolean;
    result?: IndividualResult;
}
export interface Transition<T> {
    state: T;
    error?: SerializableError;
    attempt?: Attempt;
}
export type MachineDifficulty = 'easy' | 'intermediate' | 'hard';
export type MachineGameKind = 'duel' | 'race';
export type CalculationStatus = 'idle' | 'calculating' | 'cancelled' | 'complete';
export interface MachineConfig {
    kind: MachineGameKind;
    difficulty: MachineDifficulty;
    seed: number;
    calculation: CalculationStatus;
}
export interface MachineDecisionInput {
    config: GameConfig;
    history: readonly Attempt[];
    seed: number;
    difficulty: MachineDifficulty;
}
export interface MachineDecision {
    guess: Guess;
    difficulty: MachineDifficulty;
    seed: number;
    work: number;
    latencyMs: number;
}
/** A participant snapshot intentionally has no secret or rival-owned data. */
export interface ParticipantSnapshot {
    kind: MachineGameKind;
    config: GameConfig;
    machine?: MachineConfig;
    history: readonly Attempt[];
    attemptsUsed: number;
    finished: boolean;
    result?: unknown;
    currentPlayer?: string;
    deadline?: number;
}
export declare function createMachineConfig(kind: MachineGameKind, difficulty: MachineDifficulty, seed: number): MachineConfig;
/** Pure easy policy: a deterministic probe derived only from public history and rules. */
export declare function chooseEasyGuess(input: MachineDecisionInput): MachineDecision;
/** Intermediate policy filters candidates against the machine's own scored history. */
export declare function chooseIntermediateGuess(input: MachineDecisionInput): MachineDecision;
/** Hard policy samples a bounded candidate set and chooses the most informative probe. */
export declare function chooseHardGuess(input: MachineDecisionInput): MachineDecision;
export declare function chooseMachineGuess(input: MachineDecisionInput): MachineDecision;
export interface MachineDecisionProgress {
    status: CalculationStatus;
    progress: number;
    decision?: MachineDecision;
}
export declare function calculateMachineGuess(input: MachineDecisionInput, options?: {
    signal?: AbortSignal;
    onProgress?: (progress: MachineDecisionProgress) => void;
    delayMs?: number;
}): Promise<MachineDecision>;
export type IndexSource = (exclusiveUpperBound: number) => number;
export interface RandomIndexSource {
    nextIndex(exclusiveUpperBound: number): number;
}
export declare function generateSecret(config: GameConfig | CustomLevel, source: IndexSource | RandomIndexSource): Secret;
export declare function seededIndexSource(seed: number): IndexSource;
export declare function validateSecret(value: string, config: GameConfig | CustomLevel): ValidationResult;
export declare const validateGuess: typeof validateSecret;
export declare function scoreGuess(secret: Secret, guess: Guess): Score;
export declare const evaluateScore: typeof scoreGuess;
export declare function evaluateAttempt(secret: Secret, guess: Guess, config: GameConfig | CustomLevel): Score | SerializableError;
export declare function createIndividualState(config: GameConfig | CustomLevel, secret: Secret, startedAt?: number): IndividualState;
export declare const startIndividual: typeof createIndividualState;
export declare function submitIndividualAttempt(state: IndividualState, guess: Guess, now: number): Transition<IndividualState>;
export declare const expireIndividual: (state: IndividualState, now: number) => Transition<IndividualState>;
export declare const abandonIndividual: (state: IndividualState, now: number) => Transition<IndividualState>;
export declare const interruptIndividual: (state: IndividualState, now: number) => Transition<IndividualState>;
export interface PlayerResult {
    player: string;
    outcome: IndividualOutcome;
    reason: FinalReason;
    attempts: number;
}
export interface DuelState {
    kind: 'duel';
    config: GameConfig;
    secrets: Record<string, Secret>;
    startedAt: number;
    lastTimestamp: number;
    round: number;
    currentPlayer: string;
    attempts: Record<string, number>;
    histories: Record<string, Attempt[]>;
    finished: boolean;
    machine?: MachineConfig;
    result?: {
        outcome: 'win' | 'draw';
        reason: FinalReason;
        winner?: string;
        at?: number;
        players: PlayerResult[];
    };
}
export declare function createDuelState(config: GameConfig | CustomLevel, secrets: Record<string, Secret>, startedAt?: number, machine?: MachineConfig): DuelState;
export declare function submitDuelAttempt(state: DuelState, player: string, guess: Guess, now: number): Transition<DuelState>;
export interface RaceState {
    kind: 'race';
    config: GameConfig;
    secret: Secret;
    startedAt: number;
    lastTimestamp: number;
    deadline: number;
    attempts: Record<string, number>;
    history: Array<Attempt & {
        player: string;
    }>;
    finished: boolean;
    machine?: MachineConfig;
    result?: {
        outcome: 'win' | 'draw';
        reason: FinalReason;
        winner?: string;
        at?: number;
    };
}
export declare function createRaceState(config: GameConfig | CustomLevel, secret: Secret, startedAt?: number, machine?: MachineConfig): RaceState;
export declare function expireRace(state: RaceState, now: number): RaceState;
export declare function submitRaceAttempt(state: RaceState, player: string, guess: Guess, now: number): Transition<RaceState>;
export declare const submitRaceGuess: typeof submitRaceAttempt;
export declare function createParticipantSnapshot(state: DuelState | RaceState, participant: string): ParticipantSnapshot;
export declare function serializeParticipantSnapshot(state: DuelState | RaceState, participant: string): string;
export interface SimulationMetrics {
    seed: number;
    difficulty: MachineDifficulty;
    length: number;
    repeats: boolean;
    latencyMs: number;
    resolved: boolean;
    attempts: number;
}
export declare function simulateMachine(config: GameConfig, difficulty: MachineDifficulty, seed: number, secret: Secret): SimulationMetrics;
export interface MonotonicClock {
    now(): number;
}
export declare function createMonotonicClock(read: () => number): MonotonicClock;
/** PF-06's public vocabulary. Legacy `win/loss/draw` fields remain supported
 * for PF-05 clients; this projection is the stable Spanish result contract. */
export type CompetitiveOutcome = 'victoria' | 'derrota' | 'empate' | 'abandono' | 'interrupción';
export interface UnifiedResult {
    outcome: CompetitiveOutcome;
    reason: FinalReason;
    winner?: string;
    affected?: readonly string[];
    at: number;
}
export declare function unifiedResult(outcome: CompetitiveOutcome, reason: FinalReason, at: number, options?: Omit<UnifiedResult, 'outcome' | 'reason' | 'at'>): UnifiedResult;
export declare const DEFAULT_RECONNECTION_GRACE_MS = 60000;
export interface ReconnectionParticipant {
    id: string;
    connected: boolean;
    disconnectedAt?: number;
}
export interface ReconnectionState {
    participants: Record<string, ReconnectionParticipant>;
    graceMs: number;
    paused: boolean;
    startedAt?: number;
    expiresAt?: number;
    finished: boolean;
    result?: UnifiedResult;
    lastTimestamp: number;
}
export interface ReconnectionTransition {
    state: ReconnectionState;
    error?: SerializableError;
}
export declare function createReconnectionState(ids: readonly string[], now?: number, graceMs?: number): ReconnectionState;
export declare function disconnectParticipant(state: ReconnectionState, id: string, now: number): ReconnectionTransition;
export declare function reconnectParticipant(state: ReconnectionState, id: string, now: number): ReconnectionTransition;
export declare function expireReconnectionGrace(state: ReconnectionState, now: number): ReconnectionState;
export declare function restartReconnection(state: ReconnectionState, now: number): ReconnectionState;
export declare function serialize<T>(value: T): string;
export declare function deserialize<T>(value: string): T;
/** Public, serializable state used by the individual-game presentation layer. */
export interface IndividualPublicAttempt {
    guess: string;
    at: number;
    fixed: number;
    picas: number;
}
export interface IndividualNotes {
    digits: string;
    positions: string;
}
export interface IndividualSessionState {
    screen: 'configuration' | 'tutorial' | 'game' | 'result';
    config: GameConfig;
    input: string;
    notes: IndividualNotes;
    helpsUsed: number;
    history: IndividualPublicAttempt[];
    result?: IndividualResult & {
        code: string;
        duration: number;
    };
}
export interface HelpRequest {
    config: Pick<GameConfig, 'length' | 'repeats' | 'maxAttempts'>;
    history: readonly Pick<IndividualPublicAttempt, 'guess' | 'fixed' | 'picas'>[];
    helpsUsed: number;
}
export interface HelpResponse {
    available: boolean;
    message: string;
}
/**
 * Deliberately accepts only visible configuration and scored history. A secret
 * cannot be passed to this policy accidentally because it is not part of the
 * request type or implementation.
 */
export declare function getIndividualGuidance(request: HelpRequest): HelpResponse;
