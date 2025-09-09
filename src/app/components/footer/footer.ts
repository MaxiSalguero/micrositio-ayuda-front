import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [MatFormFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  private platformId = inject(PLATFORM_ID);
  
  currentTheme: 'redif-light-theme' | 'redif-dark-theme' = 'redif-light-theme';

  ngOnInit(): void {
    let saved: 'redif-light-theme' | 'redif-dark-theme' | null = null;

    if (isPlatformBrowser(this.platformId)) {
      saved = localStorage.getItem('theme') as
        | 'redif-light-theme'
        | 'redif-dark-theme'
        | null;
    }

    this.setTheme(saved || 'redif-light-theme');
  }

  setTheme(theme: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (document && document.body) {
        const themes = ['redif-light-theme', 'redif-dark-theme'];
        themes.forEach((t) => document.body.classList.remove(t));
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
        
        this.currentTheme = theme as 'redif-light-theme' | 'redif-dark-theme';
      }
    }
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'redif-light-theme' 
      ? 'redif-dark-theme' 
      : 'redif-light-theme';
    this.setTheme(newTheme);
  }
  
  isLightTheme(): boolean {
    return this.currentTheme === 'redif-light-theme';
  }
  
  isDarkTheme(): boolean {
    return this.currentTheme === 'redif-dark-theme';
  }
}