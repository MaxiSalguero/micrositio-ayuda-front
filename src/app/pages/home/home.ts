import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SupportBox } from '../../components/support-box/support-box';
import { SearchBar } from '../../components/search-bar/search-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    MatButtonModule,
    SupportBox,
    SearchBar,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private _router = inject(Router);
  private _meta = inject(Meta);
  private _title = inject(Title);

  constructor() {
    this.updateMetaTags();
  }

  private updateMetaTags(): void {
    const title = 'Ayuda de Redif | Centro de Ayuda';
    const description = 'Centro de ayuda para alumnos, profesores y administración. Encuentra respuestas a tus preguntas sobre Redif.';
    const canonicalUrl = `${environment.appUrl}/home`;

    this._title.setTitle(title);

    this._meta.updateTag({
      name: 'description',
      content: description,
    });

    this._meta.updateTag({ property: 'og:title', content: title });
    this._meta.updateTag({
      property: 'og:description',
      content: description,
    });
    this._meta.updateTag({ property: 'og:type', content: 'website' });
    this._meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this._meta.updateTag({
      property: 'og:image',
      content: `${environment.appUrl}/images/redif_ar_logo.jpeg`,
    });

    this._meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this._meta.updateTag({ name: 'twitter:title', content: title });
    this._meta.updateTag({
      name: 'twitter:description',
      content: description,
    });
    this._meta.updateTag({
      name: 'twitter:image',
      content: `${environment.appUrl}/images/redif_ar_logo.jpeg`,
    });

    console.log('🏷️ Meta tags actualizados para Home');
  }

  handleParent(role: string): void {
    const roleRoutes: { [key: string]: string } = {
      Alumnos: 'alumnos',
      Profesores: 'profesores',
      Administración: 'administracion',
    };

    const routeRole = roleRoutes[role];
    if (routeRole) {
      this._router.navigate(['/categories', routeRole]);
    }
  }
}
