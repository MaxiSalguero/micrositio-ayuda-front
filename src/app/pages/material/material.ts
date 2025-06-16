import { Component, inject, PLATFORM_ID } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-material',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatTabsModule
  ],
  templateUrl: './material.html',
  styleUrl: './material.scss',
})
export class Material {
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    let saved: 'redif-light-theme' | 'redif-dark-theme' | null = null;
    
    if (isPlatformBrowser(this.platformId)) {
      saved = localStorage.getItem('theme') as 'redif-light-theme' | 'redif-dark-theme' | null;
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
      }
    }
  }
}
