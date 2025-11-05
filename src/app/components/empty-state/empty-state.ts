import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

/**
 * Acción opcional para el botón del EmptyState
 */
export interface EmptyStateAction {
  /** Texto del botón */
  label: string;
  /** Ruta a la que navegar */
  route: string;
}

/**
 * Componente reutilizable para mostrar estados vacíos o errores
 *
 * @example
 * ```html
 * <app-empty-state
 *   icon="error_outline"
 *   title="Categoría no encontrada"
 *   message="No pudimos cargar la información solicitada"
 *   [action]="{label: 'Volver al inicio', route: '/home'}">
 * </app-empty-state>
 * ```
 */
@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyState {
  /**
   * Icono de Material Icons a mostrar
   * @default 'info'
   */
  @Input() icon: string = 'info';

  /**
   * Título del mensaje
   */
  @Input() title?: string;

  /**
   * Mensaje descriptivo
   */
  @Input() message?: string;

  /**
   * Acción opcional con botón
   */
  @Input() action?: EmptyStateAction;
}
