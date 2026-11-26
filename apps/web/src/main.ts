import { bootstrapApplication } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
bootstrapApplication(AppComponent, {...appConfig, providers:[...(appConfig.providers ?? []), provideServiceWorker('ngsw-worker.js', { enabled: true })]}).catch(console.error);
