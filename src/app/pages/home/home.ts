import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SupportBox } from '../../components/support-box/support-box';
import { SearchBar } from '../../components/search-bar/search-bar';
import { apiToUrlRole } from '../../constants/role-mappings';
import { SeoService } from '../../services/seo.service';

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
  private _seo = inject(SeoService);

  constructor() {
    this.updateMetaTags();
  }

  private updateMetaTags(): void {
    this._seo.updateMetaTags({
      title: 'Ayuda de Redif | Centro de Ayuda',
      description: 'Centro de ayuda para alumnos, profesores y administración. Encuentra respuestas a tus preguntas sobre Redif.',
      url: '/home',
    });
  }

  handleParent(role: string): void {
    const routeRole = apiToUrlRole(role);
    if (routeRole) {
      this._router.navigate(['/categories', routeRole]);
    }
  }
}
