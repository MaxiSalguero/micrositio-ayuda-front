import { Component, inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  template: `
    <button (click)="toggleTheme()">
      Cambiar a {{ theme === 'light' ? 'oscuro' : 'claro' }}
    </button>
  `,
  styleUrl: './theme-toggle.css',
})
export class ThemeToggle implements OnInit {
  private platformId = inject(PLATFORM_ID);

  theme: 'light' | 'dark' = 'light';

  themes = {
    light: {
      '--mat-primary': '#3f51b5',
      '--mat-on-primary': '#ffffff',
      '--mat-accent': '#e91e63',
      '--mat-on-accent': '#ffffff',
      '--mat-background': '#ffffff',
      '--mat-on-background': '#000000',
      '--mat-font-family': '"Montserrat", sans-serif',
    },
    dark: {
      '--mat-primary': '#607d8b',
      '--mat-on-primary': '#ffffff',
      '--mat-accent': '#ffc107',
      '--mat-on-accent': '#000000',
      '--mat-background': '#121212',
      '--mat-on-background': '#ffffff',
      '--mat-font-family': '"Montserrat", sans-serif',
    },
  };

  ngOnInit() {
    let saved: 'light' | 'dark' | null = null;
    if (isPlatformBrowser(this.platformId)) {
      saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    }
    if (saved) {
      this.theme = saved;
    } else {
      this.theme =
        isPlatformBrowser(this.platformId) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    }
    this.applyTheme(this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.theme);
    }
    this.applyTheme(this.theme);
  }

  applyTheme(themeName: 'light' | 'dark') {
    if (isPlatformBrowser(this.platformId)) {
      const theme = this.themes[themeName];
      Object.keys(theme).forEach((variable) => {
        document.documentElement.style.setProperty(
          variable,
          theme[variable as keyof typeof theme]
        );
      });
    }
  }
}
