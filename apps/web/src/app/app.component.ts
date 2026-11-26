import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MODES, LEVELS, Level, ModeId } from '@picas-fijas/game-core';
@Component({selector:'pf-root', standalone:true, changeDetection:ChangeDetectionStrategy.OnPush, templateUrl:'./app.component.html'})
export class AppComponent {
  readonly modes = MODES; readonly levels = LEVELS; mode: ModeId = 'classic'; selectedLevel = 'classic'; theme: 'light'|'dark' = 'light'; started = false;
  readonly localHistory = ['Tu partida se prepara en este dispositivo.'];
  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem('pf-session') ?? 'null') as { mode?: ModeId; level?: string; theme?: 'light'|'dark' } | null;
      if (saved?.mode && this.modes.some((item) => item.id === saved.mode)) this.mode = saved.mode;
      if (saved?.level && (saved.level === 'custom' || this.levels.some((item) => item.id === saved.level))) this.selectedLevel = saved.level;
      if (saved?.theme === 'dark') this.theme = 'dark';
    } catch {}
  }
  setTheme(theme: 'light'|'dark') { this.theme=theme; this.persist(); }
  level(): Level | undefined { return this.levels.find((item) => item.id === this.selectedLevel); }
  modeLabel(): string { return this.modes.find((item) => item.id === this.mode)?.label ?? ''; }
  chooseMode(id: ModeId) { this.mode=id; this.persist(); }
  chooseLevel(id: string) { this.selectedLevel=id; this.persist(); }
  startGame() { this.started = true; this.persist(); }
  private persist() { try { localStorage.setItem('pf-session', JSON.stringify({ mode: this.mode, level: this.selectedLevel, theme: this.theme })); } catch {} }
}
