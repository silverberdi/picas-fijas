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
export type FinalReason = 'correct' | 'exhausted' | 'expired' | 'abandoned' | 'technical-interruption' | 'draw';
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
    round: number;
    currentPlayer: string;
    attempts: Record<string, number>;
    histories: Record<string, Attempt[]>;
    finished: boolean;
    result?: {
        outcome: 'win' | 'draw';
        reason: FinalReason;
        winner?: string;
        players: PlayerResult[];
    };
}
export declare function createDuelState(config: GameConfig | CustomLevel, secrets: Record<string, Secret>, startedAt?: number): DuelState;
export declare function submitDuelAttempt(state: DuelState, player: string, guess: Guess, now: number): Transition<DuelState>;
export interface RaceState {
    kind: 'race';
    config: GameConfig;
    secret: Secret;
    startedAt: number;
    deadline: number;
    attempts: Record<string, number>;
    history: Array<Attempt & {
        player: string;
    }>;
    finished: boolean;
    result?: {
        outcome: 'win' | 'draw';
        reason: FinalReason;
        winner?: string;
    };
}
export declare function createRaceState(config: GameConfig | CustomLevel, secret: Secret, startedAt?: number): RaceState;
export declare function expireRace(state: RaceState, now: number): RaceState;
export declare function submitRaceAttempt(state: RaceState, player: string, guess: Guess, now: number): Transition<RaceState>;
export declare const submitRaceGuess: typeof submitRaceAttempt;
export interface MonotonicClock {
    now(): number;
}
export declare function createMonotonicClock(read: () => number): MonotonicClock;
export declare function serialize<T>(value: T): string;
export declare function deserialize<T>(value: string): T;
