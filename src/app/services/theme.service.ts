import { isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  isDarkMode = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = this.readSavedTheme(); // 'dark' | 'light' | null
      const media = window.matchMedia('(prefers-color-scheme: dark)');

      if (saved) {
        this.isDarkMode.set(saved === 'dark');
      } else {
        this.isDarkMode.set(media.matches);
      }

      this.applyBodyClass(this.isDarkMode());

      if (!saved) {
        media.addEventListener?.('change', (e) => {
          this.isDarkMode.set(e.matches);
          this.applyBodyClass(e.matches);
        });
      }

      effect(() => {
        const dark = this.isDarkMode();
        try {
          localStorage.setItem('theme', dark ? 'dark' : 'light');
        } catch {}
        this.applyBodyClass(dark);
      });
    }
  }

  private readSavedTheme(): 'dark' | 'light' | null {
    try {
      const v = localStorage.getItem('theme');
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }

  private applyBodyClass(dark: boolean) {
    document.body.classList.toggle('dark-theme', dark);
    document.body.classList.toggle('light-theme', !dark);
  }

  setDarkMode(on: boolean) {
    this.isDarkMode.set(on);
  }
}
