import type { Preferences } from './local-progress';

export type SoundEvent = 'key' | 'validate' | 'feedback' | 'win' | 'lose' | 'offer';
export const SOUND_CATALOG: Readonly<Record<SoundEvent, string>> = {
  key: 'assets/audio/key.wav', validate: 'assets/audio/validate.wav', feedback: 'assets/audio/feedback.wav',
  win: 'assets/audio/win.wav', lose: 'assets/audio/lose.wav', offer: 'assets/audio/offer.wav',
};
export interface AudioPort { play(url: string, volume: number): Promise<void>; }
export interface VibrationPort { vibrate(pattern: number | number[]): boolean; }
const browserAudio: AudioPort = { async play(url, volume) { const audio = new Audio(url); audio.volume = Math.min(1, Math.max(0, volume / 100)); await audio.play(); } };
const browserVibration: VibrationPort = { vibrate(pattern) { try { return globalThis.navigator?.vibrate?.(pattern) ?? false; } catch { return false; } } };
export function motionReduced(preferences: Pick<Preferences, 'reducedMotion'>, media = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')): boolean { return preferences.reducedMotion || Boolean(media?.matches); }
export function createAudiovisualPolicy(getPreferences: () => Pick<Preferences, 'muted' | 'volume' | 'vibration'>, audio: AudioPort = browserAudio, vibration: VibrationPort = browserVibration) {
  return {
    async play(event: SoundEvent): Promise<boolean> { const preferences = getPreferences(); if (preferences.muted || preferences.volume <= 0) return false; try { await audio.play(SOUND_CATALOG[event], preferences.volume); } catch { return false; } return true; },
    vibrate(pattern: number | number[] = 12): boolean { if (!getPreferences().vibration) return false; try { return vibration.vibrate(pattern); } catch { return false; } },
  };
}
