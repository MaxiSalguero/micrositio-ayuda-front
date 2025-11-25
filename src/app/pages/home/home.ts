import { Component, inject, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SupportBox } from '../../components/support-box/support-box';
import { SearchBar } from '../../components/search-bar/search-bar';
import { SeoService } from '../../services/seo.service';
import { PageHeader, RootCategory } from '../../shared';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    MatButtonModule,
    SupportBox,
    SearchBar,
    PageHeader,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private _router = inject(Router);
  private _seo = inject(SeoService);
  private _apiService = inject(ApiService);

  // Signal para categorías raíz cargadas dinámicamente
  rootCategories = signal<RootCategory[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    this.updateMetaTags();
  }

  ngOnInit(): void {
    this.loadRootCategories();
  }

  private updateMetaTags(): void {
    this._seo.updateMetaTags({
      title: 'Ayuda de Redif | Centro de Ayuda',
      description: 'Centro de ayuda para alumnos, profesores y administración. Encuentra respuestas a tus preguntas sobre Redif.',
      url: '/home',
    });
  }

  private loadRootCategories(): void {
    this._apiService.getRootCategories().subscribe({
      next: (categories) => {
        this.rootCategories.set(categories);
        this.isLoading.set(false);
        console.log('✅ Categorías raíz cargadas:', categories);
      },
      error: (error) => {
        console.error('❌ Error al cargar categorías raíz:', error);
        this.isLoading.set(false);
      },
    });
  }

  handleCategoryClick(category: RootCategory): void {
    const slugId = `${category.slug}-${category.id}`;
    this._router.navigate(['/categories', slugId]);
  }
}
