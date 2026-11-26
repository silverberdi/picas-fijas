import test from 'node:test';
import assert from 'node:assert/strict';
import { MODES, LEVELS, isValidCustomLevel } from '../dist/index.js';
test('expone exactamente cinco modalidades', () => assert.deepEqual(MODES.map((m) => m.id), ['classic','bot-duel','bot-race','human-duel','human-race']));
test('niveles de línea base tienen reglas exactas', () => { assert.equal(LEVELS.length, 6); assert.deepEqual(LEVELS.map(({length,repeats,maxAttempts}) => ({length,repeats,maxAttempts})), [{length:3,repeats:false,maxAttempts:null},{length:4,repeats:false,maxAttempts:null},{length:4,repeats:true,maxAttempts:null},{length:5,repeats:false,maxAttempts:20},{length:5,repeats:true,maxAttempts:15},{length:6,repeats:true,maxAttempts:12}]); });
test('valida configuración personalizada', () => { assert.equal(isValidCustomLevel({length:3,repeats:false,maxAttempts:null}), true); assert.equal(isValidCustomLevel({length:6,repeats:true,maxAttempts:12}), true); assert.equal(isValidCustomLevel({length:2,repeats:false,maxAttempts:null}), false); assert.equal(isValidCustomLevel({length:4,repeats:true,maxAttempts:0}), false); });
