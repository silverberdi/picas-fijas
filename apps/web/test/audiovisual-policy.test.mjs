import test from 'node:test';
import assert from 'node:assert/strict';
import policy from './.compiled/audiovisual-policy.js';

test('la política audiovisual respeta mute/volumen y no bloquea ante reproducción bloqueada', async () => {
  const played = [];
  const audio = { play: async (url, volume) => { played.push({ url, volume }); } };
  let preferences = { muted: false, volume: 55, vibration: true };
  const controller = policy.createAudiovisualPolicy(() => preferences, audio, { vibrate: () => true });
  assert.equal(await controller.play('key'), true);
  assert.deepEqual(played[0], { url: 'assets/audio/key.wav', volume: 55 });
  preferences = { ...preferences, muted: true };
  assert.equal(await controller.play('win'), false);
  assert.equal(played.length, 1);
  preferences = { ...preferences, muted: false, vibration: false };
  assert.equal(controller.vibrate(), false);
  const failing = policy.createAudiovisualPolicy(() => ({ muted: false, volume: 80, vibration: true }), { play: async () => { throw new Error('blocked'); } }, { vibrate: () => true });
  assert.equal(await failing.play('lose'), false);
});

test('reduced motion combina la preferencia persistida con la media query', () => {
  assert.equal(policy.motionReduced({ reducedMotion: false }, { matches: true }), true);
  assert.equal(policy.motionReduced({ reducedMotion: true }, { matches: false }), true);
  assert.equal(policy.motionReduced({ reducedMotion: false }, { matches: false }), false);
});
