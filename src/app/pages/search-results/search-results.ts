import {
  Component,
  computed,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../services/api-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { IPost, PipeMarkdownPipe } from '../../shared';
import { SupportBox } from '../../components/support-box/support-box';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { BackButton } from '../../components/back-button/back-button';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
    PipeMarkdownPipe,
    RouterLink,
    SupportBox,
    MatCardModule,
    MatButtonModule,
    BackButton,
  ],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResults {
  private platformId = inject(PLATFORM_ID);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private _seo = inject(SeoService);

  private qp = toSignal(this.route.queryParams, { initialValue: {} as any });

  query = computed(() => this.qp()['q'] ?? '');
  count = computed(() => Number(this.qp()['count'] ?? 10));

  results = signal<IPost[]>([]);
  isSearching = signal(false);

  constructor() {
    effect(async () => {
      const q = this.query();
      const c = this.count();

      if (!q) {
        this.results.set([]);
        return;
      }

      this.isSearching.set(true);
      try {
        const data = await firstValueFrom(this.api.search(q, c));
        this.results.set(data ?? []);

        // Actualizar meta tags después de obtener resultados
        this.updateMetaTags(q, data?.length ?? 0);
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        this.isSearching.set(false);
      }
    });
  }

  private updateMetaTags(query: string, resultsCount: number): void {
    const title = `Resultados para "${query}" | Ayuda de Redif`;
    const description = resultsCount > 0
      ? `Se encontraron ${resultsCount} resultados para "${query}". Encuentra respuestas a tus preguntas en Ayuda de Redif.`
      : `No se encontraron resultados para "${query}". Intenta con otros términos de búsqueda.`;

    this._seo.updateMetaTags({
      title,
      description,
      url: `/search?q=${encodeURIComponent(query)}`,
    });
  }

  loadMore() {
    const nextCount = this.count() + 5;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.query(), count: nextCount },
      queryParamsHandling: 'merge',
    });
  }

  beforeNavigate() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'queryParams',
        JSON.stringify({ q: this.query(), count: this.count() })
      );
    }
  }
}
