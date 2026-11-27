import test from 'node:test';
import assert from 'node:assert/strict';
import { isDockerVerified } from './docker-startup-status.mjs';

test('requires successful docker info, build, run and health', () => {
  assert.equal(isDockerVerified({ infoStatus: 0, build: 'PASS', container: 'PASS', health: 'PASS' }), true);
  for (const failed of [
    { infoStatus: 1, build: 'PASS', container: 'PASS', health: 'PASS' },
    { infoStatus: 0, build: 'FAIL', container: 'PASS', health: 'PASS' },
    { infoStatus: 0, build: 'PASS', container: 'FAIL', health: 'PASS' },
    { infoStatus: 0, build: 'PASS', container: 'PASS', health: 'FAIL' }
  ]) {
    assert.equal(isDockerVerified(failed), false);
  }
});
