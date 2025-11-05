import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

/**
 * Componente reutilizable para mostrar estado de carga
 *
 * @example
 * ```html
 * <app-loading-state [message]="'Cargando categorías...'"></app-loading-state>
 * ```
 */
@Component({
  selector: 'app-loading-state',
  imports: [MatProgressSpinnerModule, MatCardModule],
  templateUrl: './loading-state.html',
  styleUrl: './loading-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingState {
  /**
   * Mensaje a mostrar debajo del spinner
   * @default 'Cargando...'
   */
  @Input() message: string = 'Cargando...';

  /**
   * Diámetro del spinner en píxeles
   * @default 50
   */
  @Input() diameter: number = 50;
}
