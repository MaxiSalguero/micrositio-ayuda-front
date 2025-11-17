import { Component, Input, inject, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationHistoryService } from '../../services/navigation-history.service';

@Component({
  selector: 'app-back-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.scss',
})
export class BackButton {
  private location = inject(Location);
  private router = inject(Router);
  private navigationHistory = inject(NavigationHistoryService);

  /**
   * Signal computado que determina si el botón debe ser visible.
   * Solo se muestra si hubo navegación interna en el sitio.
   */
  isVisible = computed(() => this.navigationHistory.hasInternalNavigation());

  /**
   * URL personalizada para navegar al hacer clic
   */
  @Input() customUrl?: string;

  /**
   * URL de fallback si no hay historial
   * @default '/home'
   */
  @Input() fallbackUrl: string = '/home';

  back(): void {
    if (this.customUrl) {
      this.router.navigate([this.customUrl]);
    } else if (typeof window !== 'undefined' && window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([this.fallbackUrl]);
    }
  }
}
