import { Injectable, inject } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
} from '@angular/material/snack-bar';

/**
 * Servicio centralizado para mostrar notificaciones tipo snackbar/toast
 *
 * @example
 * ```typescript
 * constructor(private snackbar: SnackbarService) {}
 *
 * onSuccess() {
 *   this.snackbar.success('¡Operación exitosa!');
 * }
 *
 * onError() {
 *   this.snackbar.error('Ocurrió un error');
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackBar = inject(MatSnackBar);

  private readonly DEFAULT_DURATION = 3000;
  private readonly ERROR_DURATION = 5000;

  /**
   * Muestra un snackbar de éxito (verde)
   */
  success(message: string, duration: number = this.DEFAULT_DURATION): void {
    this.show(message, {
      duration,
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Muestra un snackbar de error (rojo)
   */
  error(message: string, duration: number = this.ERROR_DURATION): void {
    this.show(message, {
      duration,
      panelClass: ['error-snackbar'],
    });
  }

  /**
   * Muestra un snackbar informativo (azul)
   */
  info(message: string, duration: number = this.DEFAULT_DURATION): void {
    this.show(message, {
      duration,
      panelClass: ['info-snackbar'],
    });
  }

  /**
   * Muestra un snackbar de advertencia (amarillo)
   */
  warning(message: string, duration: number = this.DEFAULT_DURATION): void {
    this.show(message, {
      duration,
      panelClass: ['warning-snackbar'],
    });
  }

  /**
   * Muestra un snackbar con configuración personalizada
   */
  private show(message: string, config: MatSnackBarConfig): void {
    this.snackBar.open(message, 'Cerrar', {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      ...config,
    });
  }
}
