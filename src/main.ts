import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router'; // Missing import
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { routes } from './app/app.routes';

// Corrected bootstrap call
bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideRouter(routes) // Add router provider
  ]
}).catch(err => console.error(err));