import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
if ('serviceWorker' in navigator) void navigator.serviceWorker.register('pf-sw.js', { scope: './' }).catch(() => undefined);
bootstrapApplication(AppComponent, appConfig).catch(console.error);
