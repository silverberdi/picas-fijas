import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { abandonIndividual, configFromLevel, createIndividualState, getIndividualGuidance, generateSecret, IndividualNotes, IndividualState, isValidCustomLevel, LEVELS, MODES, ModeId, seededIndexSource, serialize, submitIndividualAttempt, validateSecret } from '@picas-fijas/game-core';
type Screen = 'configuration' | 'tutorial' | 'game' | 'result';
@Component({selector:'pf-root', standalone:true, changeDetection:ChangeDetectionStrategy.Default, templateUrl:'./app.component.pf03.html'})
export class AppComponent {
  readonly modes = MODES; readonly levels = LEVELS; mode: ModeId = 'classic'; selectedLevel = 'classic'; theme: 'light'|'dark' = 'light'; screen: Screen = 'configuration';
  customLevel = { length: 3, repeats: false, maxAttempts: null as number | null }; customLevelError = '';
  input = ''; inputError = ''; helpMessage = ''; helpsUsed = 0; elapsed = 0; notes: IndividualNotes = { digits: '', positions: '' }; game: IndividualState | null = null;
  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem('pf-session') ?? 'null') as { mode?: ModeId; level?: string; theme?: 'light'|'dark'; customLevel?: { length: number; repeats: boolean; maxAttempts: number | null } } | null;
      if (saved?.mode && this.modes.some((item) => item.id === saved.mode)) this.mode = saved.mode;
      if (saved?.level && (saved.level === 'custom' || this.levels.some((item) => item.id === saved.level))) this.selectedLevel = saved.level;
      if (saved?.theme === 'dark') this.theme = 'dark';
      if (saved?.customLevel && isValidCustomLevel(saved.customLevel)) this.customLevel = saved.customLevel;
    } catch {}
  }
  @HostListener('window:keydown', ['$event']) handleKeyboard(event: KeyboardEvent) { if (this.screen !== 'game' || (event.target as HTMLElement | null)?.matches('textarea, input')) return; if (/^\d$/.test(event.key)) { event.preventDefault(); this.addDigit(event.key); } if (event.key === 'Backspace') { event.preventDefault(); this.eraseDigit(); } if (event.key === 'Enter') { event.preventDefault(); this.confirmGuess(); } }
  setTheme(theme: 'light'|'dark') { this.theme=theme; this.persist(); }
  level() { return this.selectedLevel === 'custom' ? this.customLevel : this.levels.find((item) => item.id === this.selectedLevel); }
  modeLabel(): string { return this.modes.find((item) => item.id === this.mode)?.label ?? ''; }
  chooseMode(id: ModeId) { this.mode=id; this.persist(); }
  chooseLevel(id: string) { this.selectedLevel=id; this.customLevelError = ''; this.persist(); }
  setCustomLength(event: Event) { this.customLevel = { ...this.customLevel, length: Number((event.target as HTMLInputElement).value) }; this.validateCustomLevel(); }
  setCustomRepeats(event: Event) { this.customLevel = { ...this.customLevel, repeats: (event.target as HTMLInputElement).checked }; this.validateCustomLevel(); }
  setCustomLimit(event: Event) { const input = event.target as HTMLInputElement; this.customLevel = { ...this.customLevel, maxAttempts: input.checked ? 10 : null }; this.validateCustomLevel(); }
  setCustomAttempts(event: Event) { this.customLevel = { ...this.customLevel, maxAttempts: Number((event.target as HTMLInputElement).value) }; this.validateCustomLevel(); }
  isCustomLevelValid() { return isValidCustomLevel(this.customLevel); }
  applyCustomLevel() { if (!this.validateCustomLevel()) return; this.selectedLevel = 'custom'; this.persist(); }
  private validateCustomLevel() { this.customLevelError = isValidCustomLevel(this.customLevel) ? '' : 'Elige una longitud entre 3 y 6 y un límite mayor que cero.'; return !this.customLevelError; }
  startGame() { if (this.selectedLevel === 'custom' && !this.validateCustomLevel()) return; const selected = this.level(); if (!selected) return; const config = configFromLevel(selected); const now = Date.now(); this.game = createIndividualState(config, generateSecret(config, seededIndexSource(now)), now); this.screen = 'game'; this.input = ''; this.inputError = ''; this.helpMessage = ''; this.helpsUsed = 0; this.elapsed = 0; this.notes = { digits: '', positions: '' }; this.persist(); }
  addDigit(digit: string) { if (!this.game || this.game.finished || this.input.length >= this.game.config.length) return; this.input += digit; this.inputError = ''; }
  eraseDigit() { this.input = this.input.slice(0, -1); this.inputError = ''; }
  confirmGuess() { if (!this.game) return; const validation = validateSecret(this.input, this.game.config); if (!validation.valid) { this.inputError = validation.error?.message ?? 'Revisa la tentativa.'; return; } const now = Math.max(this.game.lastTimestamp, Date.now()); const transition = submitIndividualAttempt(this.game, this.input, now); if (transition.error) { this.inputError = transition.error.message; return; } this.game = transition.state; this.elapsed = Math.max(0, now - this.game.startedAt); this.input = ''; this.inputError = ''; if (this.game.finished) this.screen = 'result'; }
  requestHelp() { if (!this.game) return; const response = getIndividualGuidance({ config: this.game.config, history: this.game.history.map((attempt) => ({ guess: attempt.guess, fixed: attempt.score.fixed, picas: attempt.score.picas })), helpsUsed: this.helpsUsed }); this.helpMessage = response.message; if (response.available && this.helpsUsed < 3) this.helpsUsed += 1; }
  updateNote(kind: 'digits' | 'positions', event: Event) { this.notes = { ...this.notes, [kind]: (event.target as HTMLTextAreaElement).value }; }
  abandon() { if (this.game && !this.game.finished) { this.game = abandonIndividual(this.game, Math.max(this.game.lastTimestamp, Date.now())).state; this.screen = 'result'; } }
  showTutorial() { this.screen = 'tutorial'; }
  goHome() { this.screen = 'configuration'; this.game = null; }
  replay() { this.startGame(); }
  resultLabel() { return this.game?.result?.outcome === 'win' ? '¡Victoria!' : this.game?.result?.outcome === 'abandoned' ? 'Partida abandonada' : 'Partida terminada'; }
  resultReason() { return this.game?.result?.reason === 'exhausted' ? 'Se agotaron los intentos.' : this.game?.result?.reason === 'abandoned' ? 'Decidiste dejar la partida.' : this.game?.result?.reason === 'correct' ? 'Encontraste el código secreto.' : ''; }
  private persist() { try { localStorage.setItem('pf-session', serialize({ mode: this.mode, level: this.selectedLevel, theme: this.theme, customLevel: this.customLevel })); } catch {} }
}
