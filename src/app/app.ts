import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  TransferState,
  makeStateKey,
} from '@angular/core';
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
import { isPlatformBrowser, isPlatformServer, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

// Clave única para el estado que queremos transferir.
// Buena práctica definirla fuera de la clase.
const TITLE_KEY = makeStateKey<string>('appTitle');

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
  protected title: string = 'Cargando título...';
  isDarkTheme: boolean = false;

  private _http = inject(HttpClient);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  private urlBase: string = 'http://localhost:3000';

  constructor() {
    const storedTitle = this.transferState.get(TITLE_KEY, null);

    if (isPlatformBrowser(this.platformId)) {
      if (storedTitle !== null) {
        this.title = storedTitle;
      }
      this.transferState.remove(TITLE_KEY);
    } else if (isPlatformServer(this.platformId)) {
      this._http
        .get(this.urlBase, { responseType: 'text' })
        .pipe(
          tap((apiTitle) => {
            // tap es para "efectos secundarios". Aquí, guardamos el título en TransferState.
            this.transferState.set(TITLE_KEY, apiTitle);
          })
        )
        .subscribe({
          next: (apiTitle) => {
            this.title = apiTitle;
          },
          error: (err) => {
            console.error('Error fetching title on server:', err);
            const errorTitle = 'Error al cargar título (servidor)';
            this.title = errorTitle;
            // También es buena idea transferir el estado de error.
            this.transferState.set(TITLE_KEY, errorTitle);
          },
        });
    }
  }

  ngOnInit(): void {
    this.setTheme('redif-light-theme');
  }

  setTheme(theme: string) {
    if (isPlatformBrowser(this.platformId)) {
      if (document && document.body) {
        const themes = ['redif-light-theme', 'redif-dark-theme'];
        themes.forEach((t) => document.body.classList.remove(t));
        document.body.classList.add(theme);
        this.isDarkTheme = theme === 'redif-dark-theme';
      }
    }
  }
}
