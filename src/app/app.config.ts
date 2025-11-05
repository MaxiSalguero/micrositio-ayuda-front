import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  DOCUMENT,
  ErrorHandler,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { errorInterceptor } from './interceptors/error.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    // Configura HttpClient usando las funciones de proveedor recomendadas
    provideHttpClient(
      withFetch(), // Habilita el uso de la API fetch para un mejor rendimiento en SSR
      withInterceptors([errorInterceptor]) // Interceptor global de errores
    ),
    provideMarkdown(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

    // Inicialización de íconos personalizados
    {
      provide: MatIconRegistry,
      deps: [HttpClient, DomSanitizer, DOCUMENT, ErrorHandler],
      useFactory: (
        http: HttpClient,
        sanitizer: DomSanitizer,
        document: Document,
        errorHandler: ErrorHandler
      ) => {
        const registry = new MatIconRegistry(
          http,
          sanitizer,
          document,
          errorHandler
        );

        registry.addSvgIcon(
          'redif',
          sanitizer.bypassSecurityTrustResourceUrl('/images/icon-robot.svg')
        );

        registry.addSvgIcon(
          'redif-dark',
          sanitizer.bypassSecurityTrustResourceUrl(
            '/images/icono-robot-dark.svg'
          )
        );

        return registry;
      },
    },
  ],
};
