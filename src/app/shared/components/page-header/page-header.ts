import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BackButton } from '../../../components/back-button/back-button';

/**
 * Componente reutilizable para encabezado de página con botón de retroceso y título
 *
 * @example
 * ```html
 * <app-page-header
 *   [showBackButton]="true"
 *   [backUrl]="'/home'"
 *   title="Temas de ayuda para Alumnos">
 * </app-page-header>
 * ```
 */
@Component({
  selector: 'app-page-header',
  imports: [BackButton],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  /**
   * Mostrar botón de retroceso
   * @default true
   */
  @Input() showBackButton: boolean = true;

  /**
   * URL personalizada para el botón de retroceso
   */
  @Input() backUrl?: string;

  /**
   * Título de la página
   */
  @Input() title?: string;

  /**
   * Reduce el margin-bottom para un espaciado más compacto
   * @default false
   */
  @Input() compact: boolean = false;
}
