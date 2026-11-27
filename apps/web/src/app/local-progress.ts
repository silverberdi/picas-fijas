export const LOCAL_DB_NAME = 'picas-fijas-local';
export const LOCAL_DB_VERSION = 2;
export const RESULTS_STORE = 'game-results';
export const PREFERENCES_STORE = 'preferences';

export type TerminalOutcome = 'victory' | 'defeat' | 'draw' | 'abandonment' | 'technical-interruption';
export type GameMode = 'classic' | 'bot-duel' | 'bot-race' | 'human-duel' | 'human-race';
export type Assistance = 'none' | 'guided';
export type Intelligence = 'human' | 'machine';

export interface ResultDimensions {
  mode: GameMode;
  rules: string;
  difficulty: string;
  intelligence: Intelligence;
  assistance: Assistance;
}

export interface TerminalResult extends ResultDimensions {
  resultId?: string;
  outcome: TerminalOutcome;
  durationMs: number;
  attempts: number;
  minAttempts: number;
  occurredAt: number;
  schemaVersion?: number;
}

export interface StoredResult extends Omit<TerminalResult, 'resultId'> {
  resultId: string;
  schemaVersion: number;
}

export interface ResultFilter {
  mode?: GameMode;
  rules?: string;
  difficulty?: string;
  intelligence?: Intelligence;
  assistance?: Assistance;
}

export interface Statistics {
  total: number;
  victories: number;
  defeats: number;
  draws: number;
  winRate: number | null;
  averageAttempts: number | null;
  bestTimeMs: number | null;
  bestAttempts: number | null;
  currentStreak: number;
  bestStreak: number;
  evolution: StoredResult[];
}

export interface Medal {
  id: 'first-win' | 'three-wins' | 'five-streak' | 'versatile' | 'precision' | 'speed';
  name: string;
  criterion: string;
  earned: boolean;
  firstEarnedAt: number | null;
}

export interface Preferences {
  theme: 'light' | 'dark';
  volume: number;
  muted: boolean;
  vibration: boolean;
  reducedMotion: boolean;
  schemaVersion: number;
}

export const DEFAULT_PREFERENCES: Preferences = { theme: 'light', volume: 70, muted: false, vibration: true, reducedMotion: false, schemaVersion: LOCAL_DB_VERSION };

const ELIGIBLE_OUTCOMES = new Set<TerminalOutcome>(['victory', 'defeat', 'draw']);
const MEDAL_CATALOG: ReadonlyArray<Omit<Medal, 'earned' | 'firstEarnedAt'>> = [
  { id: 'first-win', name: 'Primer triunfo', criterion: 'Primera victoria' },
  { id: 'three-wins', name: 'Tres triunfos', criterion: 'Tres victorias' },
  { id: 'five-streak', name: 'Racha de cinco', criterion: 'Cinco victorias consecutivas en el filtro exacto' },
  { id: 'versatile', name: 'Polivalente', criterion: 'Una victoria en cada modalidad aprobada' },
  { id: 'precision', name: 'Precisión', criterion: 'Victoria en el mínimo de intentos permitido' },
  { id: 'speed', name: 'Velocista', criterion: 'Victoria en 30 segundos o menos' },
];

function canonical(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  return `{${Object.keys(value as Record<string, unknown>).sort().map((key) => `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`).join(',')}}`;
}

export function stableResultId(result: TerminalResult): string {
  const input = canonical({ mode: result.mode, rules: result.rules, difficulty: result.difficulty, intelligence: result.intelligence, assistance: result.assistance, outcome: result.outcome, durationMs: result.durationMs, attempts: result.attempts, minAttempts: result.minAttempts, occurredAt: result.occurredAt });
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) { hash ^= input.charCodeAt(index); hash = Math.imul(hash, 16777619); }
  return `result-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function isEligibleResult(result: TerminalResult): boolean {
  return ELIGIBLE_OUTCOMES.has(result.outcome) && result.durationMs >= 0 && result.attempts >= 0 && result.minAttempts > 0 && Number.isFinite(result.occurredAt);
}

export function normalizeResult(result: TerminalResult): StoredResult | null {
  if (!isEligibleResult(result)) return null;
  return { ...result, resultId: result.resultId ?? stableResultId(result), schemaVersion: LOCAL_DB_VERSION };
}

export function matchesFilter(result: StoredResult, filter: ResultFilter = {}): boolean {
  return Object.entries(filter).every(([key, value]) => value === undefined || result[key as keyof ResultFilter] === value);
}

export function calculateStatistics(results: readonly StoredResult[], filter: ResultFilter = {}): Statistics {
  const selected = results.filter((result) => matchesFilter(result, filter)).sort((a, b) => a.occurredAt - b.occurredAt || a.resultId.localeCompare(b.resultId));
  const victories = selected.filter((result) => result.outcome === 'victory');
  let currentStreak = 0; let bestStreak = 0;
  for (const result of selected) { currentStreak = result.outcome === 'victory' ? currentStreak + 1 : 0; bestStreak = Math.max(bestStreak, currentStreak); }
  return { total: selected.length, victories: victories.length, defeats: selected.filter((result) => result.outcome === 'defeat').length, draws: selected.filter((result) => result.outcome === 'draw').length, winRate: selected.length ? victories.length / selected.length : null, averageAttempts: selected.length ? selected.reduce((sum, result) => sum + result.attempts, 0) / selected.length : null, bestTimeMs: victories.length ? Math.min(...victories.map((result) => result.durationMs)) : null, bestAttempts: victories.length ? Math.min(...victories.map((result) => result.attempts)) : null, currentStreak, bestStreak, evolution: selected };
}

function firstAt(results: readonly StoredResult[], predicate: (result: StoredResult, index: number) => boolean): number | null {
  return results.find((result, index) => predicate(result, index))?.occurredAt ?? null;
}

export function evaluateMedals(results: readonly StoredResult[]): Medal[] {
  const ordered = [...results].filter((result) => isEligibleResult(result)).sort((a, b) => a.occurredAt - b.occurredAt || a.resultId.localeCompare(b.resultId));
  const wins = ordered.filter((result) => result.outcome === 'victory');
  const modes = new Set(wins.map((result) => result.mode));
  const approvedModes: GameMode[] = ['classic', 'bot-duel', 'bot-race', 'human-duel', 'human-race'];
  let streak = 0;
  const fiveStreakAt = firstAt(ordered, (result) => { streak = result.outcome === 'victory' ? streak + 1 : 0; return streak >= 5; });
  const earnedAt = [
    firstAt(ordered, (result) => result.outcome === 'victory'),
    firstAt(ordered, (_result, index) => wins.length >= 3 && ordered[index].outcome === 'victory' && wins.indexOf(ordered[index]) === 2),
    fiveStreakAt,
    approvedModes.every((mode) => modes.has(mode)) ? wins.reduce((date, result) => Math.max(date, result.occurredAt), 0) || null : null,
    firstAt(ordered, (result) => result.outcome === 'victory' && result.attempts === result.minAttempts),
    firstAt(ordered, (result) => result.outcome === 'victory' && result.durationMs <= 30_000),
  ];
  return MEDAL_CATALOG.map((medal, index) => ({ ...medal, earned: earnedAt[index] !== null, firstEarnedAt: earnedAt[index] }));
}

export function validatePreferences(value: Partial<Preferences> | null | undefined): Preferences {
  const volume = Number(value?.volume);
  return { theme: value?.theme === 'dark' ? 'dark' : 'light', volume: Number.isFinite(volume) ? Math.min(100, Math.max(0, Math.round(volume))) : DEFAULT_PREFERENCES.volume, muted: value?.muted === true, vibration: value?.vibration !== false, reducedMotion: value?.reducedMotion === true, schemaVersion: LOCAL_DB_VERSION };
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> { return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
function transactionDone(transaction: IDBTransaction): Promise<void> { return new Promise((resolve, reject) => { transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error); transaction.onabort = () => reject(transaction.error ?? new Error('Transacción abortada')); }); }

export function openLocalDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCAL_DB_NAME, LOCAL_DB_VERSION);
    request.onupgradeneeded = () => { const db = request.result; if (!db.objectStoreNames.contains(RESULTS_STORE)) db.createObjectStore(RESULTS_STORE, { keyPath: 'resultId' }); if (!db.objectStoreNames.contains(PREFERENCES_STORE)) db.createObjectStore(PREFERENCES_STORE, { keyPath: 'id' }); };
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
}

export async function listResults(): Promise<StoredResult[]> {
  const db = await openLocalDatabase(); const transaction = db.transaction(RESULTS_STORE, 'readonly'); const results = await requestToPromise(transaction.objectStore(RESULTS_STORE).getAll()); await transactionDone(transaction); db.close(); return results;
}

export async function acceptResult(result: TerminalResult): Promise<{ accepted: boolean; result: StoredResult | null }> {
  const normalized = normalizeResult(result); if (!normalized) return { accepted: false, result: null };
  const db = await openLocalDatabase(); const transaction = db.transaction(RESULTS_STORE, 'readwrite'); const store = transaction.objectStore(RESULTS_STORE); const existing = await requestToPromise(store.get(normalized.resultId)); if (!existing) store.add(normalized); await transactionDone(transaction); db.close(); return { accepted: !existing, result: normalized };
}

export async function readPreferences(): Promise<Preferences> { const db = await openLocalDatabase(); const transaction = db.transaction(PREFERENCES_STORE, 'readonly'); const value = await requestToPromise(transaction.objectStore(PREFERENCES_STORE).get('singleton')); await transactionDone(transaction); db.close(); return validatePreferences(value); }
export async function savePreferences(value: Partial<Preferences>): Promise<Preferences> { const preferences = validatePreferences(value); const db = await openLocalDatabase(); const transaction = db.transaction(PREFERENCES_STORE, 'readwrite'); transaction.objectStore(PREFERENCES_STORE).put({ id: 'singleton', ...preferences }); await transactionDone(transaction); db.close(); return preferences; }
export async function resetPreferences(): Promise<Preferences> { return savePreferences(DEFAULT_PREFERENCES); }
