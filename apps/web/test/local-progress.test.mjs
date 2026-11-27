import test from 'node:test';
import assert from 'node:assert/strict';
import progress from './.compiled/local-progress.js';

const { DEFAULT_PREFERENCES, LOCAL_DB_VERSION, calculateStatistics, evaluateMedals, normalizeResult, stableResultId, validatePreferences } = progress;
const base = (overrides = {}) => ({ mode: 'classic', rules: '3-unique-10', difficulty: 'classic', intelligence: 'human', assistance: 'none', outcome: 'victory', durationMs: 12_000, attempts: 1, minAttempts: 1, occurredAt: 1_000, ...overrides });

test('normaliza resultados elegibles e idempotentes sin IP ni progreso', () => {
  const first = normalizeResult(base());
  const second = normalizeResult(base());
  assert.deepEqual(first, second);
  assert.equal(first.schemaVersion, LOCAL_DB_VERSION);
  assert.equal(Object.hasOwn(first, 'ip'), false);
  assert.equal(Object.hasOwn(first, 'progress'), false);
  assert.equal(stableResultId(base()), stableResultId(base()));
  assert.equal(normalizeResult(base({ outcome: 'abandonment' })), null);
  assert.equal(normalizeResult(base({ outcome: 'technical-interruption' })), null);
});

test('agrega sólo coincidencias exactas y deja vacío sin datos', () => {
  const results = [
    normalizeResult(base({ resultId: 'a', occurredAt: 1, durationMs: 20_000 })),
    normalizeResult(base({ resultId: 'b', occurredAt: 2, outcome: 'defeat', assistance: 'guided' })),
    normalizeResult(base({ resultId: 'c', occurredAt: 3, outcome: 'draw' })),
  ].filter(Boolean);
  const stats = calculateStatistics(results, { assistance: 'none', mode: 'classic' });
  assert.equal(stats.total, 2); assert.equal(stats.victories, 1); assert.equal(stats.defeats, 0); assert.equal(stats.draws, 1); assert.equal(stats.winRate, 0.5); assert.equal(stats.bestTimeMs, 20_000);
  assert.equal(calculateStatistics([], {}).winRate, null);
  assert.equal(calculateStatistics([], {}).averageAttempts, null);
});

test('compone filtros de todas las dimensiones sin mezclar resultados', () => {
  const results = [
    normalizeResult(base({ resultId: 'exact' })),
    normalizeResult(base({ resultId: 'rules', rules: '4-repeats-10' })),
    normalizeResult(base({ resultId: 'difficulty', difficulty: 'expert' })),
    normalizeResult(base({ resultId: 'intelligence', intelligence: 'machine' })),
    normalizeResult(base({ resultId: 'assistance', assistance: 'guided' })),
  ].filter(Boolean);
  assert.equal(calculateStatistics(results, { mode: 'classic', rules: '3-unique-10', difficulty: 'classic', intelligence: 'human', assistance: 'none' }).total, 1);
});

test('evalúa seis medallas determinísticamente y excluye neutros', () => {
  const results = Array.from({ length: 5 }, (_, index) => normalizeResult(base({ resultId: `win-${index}`, occurredAt: index + 1, durationMs: index === 0 ? 20_000 : 40_000 }))).filter(Boolean);
  const medals = evaluateMedals(results);
  assert.equal(medals.length, 6);
  assert.deepEqual(medals.map((medal) => medal.earned), [true, true, true, false, true, true]);
  assert.equal(medals[0].firstEarnedAt, 1);
  assert.deepEqual(evaluateMedals(results), evaluateMedals([...results]), 'la reevaluación debe ser reproducible');
  assert.equal(evaluateMedals([...results, normalizeResult(base({ resultId: 'neutral', outcome: 'draw', occurredAt: 9 }))]).find((medal) => medal.id === 'five-streak').earned, true);
});

test('Polivalente registra la fecha en que se completa la quinta modalidad', () => {
  const modes = ['classic', 'bot-duel', 'bot-race', 'human-duel', 'human-race'];
  const results = modes.map((mode, index) => normalizeResult(base({ resultId: mode, mode, occurredAt: (index + 1) * 1_000 }))).filter(Boolean);
  const laterWin = normalizeResult(base({ resultId: 'later', mode: 'classic', occurredAt: 99_000 }));
  const medal = evaluateMedals([...results, laterWin]).find((item) => item.id === 'versatile');
  assert.equal(medal?.earned, true);
  assert.equal(medal?.firstEarnedAt, 5_000);
});

test('la racha de cinco exige una única dimensión exacta', () => {
  const mixedDimensions = Array.from({ length: 4 }, (_, index) => normalizeResult(base({ resultId: `classic-${index}`, occurredAt: index + 1 })))
    .concat(normalizeResult(base({ resultId: 'bot-duel', mode: 'bot-duel', occurredAt: 5 })))
    .filter(Boolean);
  assert.equal(evaluateMedals(mixedDimensions).find((medal) => medal.id === 'five-streak').earned, false);

  const sameDimension = mixedDimensions.concat(normalizeResult(base({ resultId: 'classic-4', occurredAt: 6 }))).filter(Boolean);
  assert.equal(evaluateMedals(sameDimension).find((medal) => medal.id === 'five-streak').earned, true);
});

test('valida preferencias y restaura defaults sin aceptar valores inválidos', () => {
  assert.deepEqual(validatePreferences({ theme: 'dark', volume: 120, muted: true, vibration: false, reducedMotion: true }).volume, 100);
  assert.deepEqual(validatePreferences({ volume: -4 }).volume, 0);
  assert.deepEqual(validatePreferences(null), DEFAULT_PREFERENCES);
});
