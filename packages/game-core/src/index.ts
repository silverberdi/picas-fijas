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
  return Number.isInteger(value.length) && value.length >= 3 && value.length <= 6 && (value.maxAttempts === null || (Number.isInteger(value.maxAttempts) && value.maxAttempts > 0));
}
