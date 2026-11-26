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
    return Number.isInteger(value.length) && value.length >= 3 && value.length <= 6 && (value.maxAttempts === null || (Number.isInteger(value.maxAttempts) && value.maxAttempts > 0));
}
