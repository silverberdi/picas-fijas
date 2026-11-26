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
