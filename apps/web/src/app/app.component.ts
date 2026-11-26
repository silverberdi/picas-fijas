import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MODES, LEVELS, CustomLevel, isValidCustomLevel, Level, ModeId } from '@picas-fijas/game-core';
@Component({selector:'pf-root', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, templateUrl:'./app.component.html'})
export class AppComponent {
  readonly modes = MODES; readonly levels = LEVELS; mode: ModeId = 'classic'; selectedLevel = 'classic'; theme: 'light'|'dark' = 'light'; started = false;
  customLevel: CustomLevel = { length: 3, repeats: false, maxAttempts: null };
  customLevelError = '';
  readonly localHistory = ['Tu partida se prepara en este dispositivo.'];
  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem('pf-session') ?? 'null') as { mode?: ModeId; level?: string; theme?: 'light'|'dark'; customLevel?: CustomLevel } | null;
      if (saved?.mode && this.modes.some((item) => item.id === saved.mode)) this.mode = saved.mode;
      if (saved?.level && (saved.level === 'custom' || this.levels.some((item) => item.id === saved.level))) this.selectedLevel = saved.level;
      if (saved?.theme === 'dark') this.theme = 'dark';
      if (saved?.customLevel && isValidCustomLevel(saved.customLevel)) this.customLevel = saved.customLevel;
    } catch {}
  }
  setTheme(theme: 'light'|'dark') { this.theme=theme; this.persist(); }
  level(): Level | CustomLevel | undefined { return this.selectedLevel === 'custom' ? this.customLevel : this.levels.find((item) => item.id === this.selectedLevel); }
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
  startGame() { this.started = true; this.persist(); }
  private persist() { try { localStorage.setItem('pf-session', JSON.stringify({ mode: this.mode, level: this.selectedLevel, theme: this.theme, customLevel: this.customLevel })); } catch {} }
}
