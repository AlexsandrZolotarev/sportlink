import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { mockHttpInterceptor } from '../shared/api/mock-http.interceptor';

/**
 * Application configuration.
 *
 * To switch from mock API to a real backend:
 *   1. Remove `mockHttpInterceptor` from `withInterceptors([...])`
 *   2. Point API calls at your real base URL (e.g. via environment variables)
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
    ),
    provideHttpClient(
      withInterceptors([mockHttpInterceptor]),
    ),
    provideAnimationsAsync(),
  ],
};
