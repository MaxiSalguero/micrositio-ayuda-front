import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { RouterOutlet } from '@angular/router';

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
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
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
    MatTabsModule,
    NgClass,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'micrositeHelpFront';
  isDarkTheme: boolean = false;

  ngOnInit(): void {
    this.setTheme('redif-light-theme');
  }

  setTheme(theme: string) {
    if (typeof document !== 'undefined' && document.body) {
      const themes = ['redif-light-theme', 'redif-dark-theme'];
      themes.forEach((t) => document.body.classList.remove(t));
      document.body.classList.add(theme);
      this.isDarkTheme = theme === 'redif-dark-theme';
    }
  }
}
