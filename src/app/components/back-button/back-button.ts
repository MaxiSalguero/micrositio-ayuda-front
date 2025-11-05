import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.scss',
})
export class BackButton {
  private location = inject(Location);
  private router = inject(Router);

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
