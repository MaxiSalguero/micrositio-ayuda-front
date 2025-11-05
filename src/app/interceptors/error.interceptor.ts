import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

/**
 * Interceptor para manejo global de errores HTTP
 *
 * Captura todos los errores HTTP y muestra notificaciones al usuario
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(SnackbarService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
        console.error('Error del cliente:', error.error.message);
      } else {
        // Error del lado del servidor
        console.error(
          `Error ${error.status}: ${error.message}`,
          error.error
        );

        switch (error.status) {
          case 400:
            errorMessage = 'Solicitud incorrecta';
            break;
          case 401:
            errorMessage = 'No autorizado';
            break;
          case 403:
            errorMessage = 'Acceso denegado';
            break;
          case 404:
            errorMessage = 'Recurso no encontrado';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          case 503:
            errorMessage = 'Servicio no disponible';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Mostrar snackbar de error
      snackbar.error(errorMessage);

      return throwError(() => error);
    })
  );
};
