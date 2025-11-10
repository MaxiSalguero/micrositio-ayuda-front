import { Component, inject, signal, effect, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SearchBar } from '../search-bar/search-bar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    MatExpansionModule,
    MatRadioModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    SearchBar,
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  themeService = inject(ThemeService);
  private router = inject(Router);

  isHomePage = signal(false);
  isSearchOpen = signal(false);

  @ViewChild('searchBarRef') searchBarRef: ElementRef | undefined;

  constructor() {
    // Detectar ruta inicial
    this.updateHomePage(this.router.url);

    // Suscribirse a cambios de ruta
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateHomePage(event.urlAfterRedirects);
      });
  }

  private updateHomePage(url: string): void {
    this.isHomePage.set(url === '/home' || url === '/');
    // Cerrar automáticamente el search overlay al cambiar de página
    this.isSearchOpen.set(false);
  }

  toggleMobileSearch(): void {
    this.isSearchOpen.update(value => !value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Solo actuar si el search overlay está abierto y NO es home
    if (!this.isSearchOpen() || this.isHomePage()) {
      return;
    }

    const target = event.target as HTMLElement;

    // Obtener referencias a los elementos
    const searchBarElement = this.searchBarRef?.nativeElement;
    const searchIcon = document.querySelector('.navbar-search-mobile-icon');

    // Si el click NO está en el search bar ni en el icono de búsqueda, cerrar
    if (searchBarElement && !searchBarElement.contains(target) &&
        searchIcon && !searchIcon.contains(target)) {
      this.isSearchOpen.set(false);
    }
  }
}
