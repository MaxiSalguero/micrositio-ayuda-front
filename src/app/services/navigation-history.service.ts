import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Servicio para rastrear el historial de navegación interna del sitio.
 * Permite determinar si el usuario ha navegado dentro del sitio o llegó desde una fuente externa.
 */
@Injectable({ providedIn: 'root' })
export class NavigationHistoryService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  /**
   * Signal que indica si ha habido navegación interna en el sitio.
   * Comienza en `false` y se actualiza a `true` después del primer evento NavigationEnd.
   */
  private _hasInternalNavigation = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Intentar cargar estado previo de sessionStorage
      this.loadFromStorage();

      // Escuchar eventos de navegación del Router
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          // Marcar que hubo navegación interna
          this._hasInternalNavigation.set(true);
        });

      // Persistir cambios en sessionStorage automáticamente
      effect(() => {
        const hasNav = this._hasInternalNavigation();
        try {
          sessionStorage.setItem('hasInternalNavigation', JSON.stringify(hasNav));
        } catch {
          // Ignorar errores de almacenamiento
        }
      });
    }
  }

  /**
   * Retorna si ha habido navegación interna en el sitio.
   */
  hasInternalNavigation(): boolean {
    return this._hasInternalNavigation();
  }

  /**
   * Carga el estado de navegación desde sessionStorage.
   * Útil para mantener el estado después de recargas de página.
   */
  private loadFromStorage(): void {
    try {
      const stored = sessionStorage.getItem('hasInternalNavigation');
      if (stored !== null) {
        const hasNav = JSON.parse(stored) as boolean;
        this._hasInternalNavigation.set(hasNav);
      }
    } catch {
      // Si hay error al leer, mantener el valor por defecto (false)
    }
  }

  /**
   * Resetea el estado de navegación interna.
   * Útil para testing o casos especiales.
   */
  reset(): void {
    this._hasInternalNavigation.set(false);
    try {
      sessionStorage.removeItem('hasInternalNavigation');
    } catch {
      // Ignorar errores
    }
  }
}
