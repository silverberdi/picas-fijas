import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('estadísticas exponen filtros exactos para cada dimensión', () => {
  const component = fs.readFileSync(new URL('../src/app/app.component.ts', import.meta.url), 'utf8');
  const template = fs.readFileSync(new URL('../src/app/app.component.pf03.html', import.meta.url), 'utf8');
  for (const dimension of ['rules', 'difficulty', 'intelligence', 'assistance']) {
    assert.match(template, new RegExp(`setResultFilter\\('${dimension}'`));
    assert.match(template, new RegExp(`stats-${dimension}`));
  }
  assert.match(component, /filterResults\(next\)/);
});
