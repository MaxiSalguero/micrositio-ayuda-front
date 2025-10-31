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
import { IPost } from '../../models/post.model';
import { MatIconModule } from '@angular/material/icon';
import { PipeMarkdownPipe } from '../../pipes/pipe-markdown-pipe';
import { SupportBox } from '../../components/support-box/support-box';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { BackButton } from '../../components/back-button/back-button';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search',
  imports: [
    MatListModule,
    MatIconModule,
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
  private _meta = inject(Meta);
  private _title = inject(Title);

  private qp = toSignal(this.route.queryParams, { initialValue: {} as any });

  query = computed(() => this.qp()['q'] ?? '');
  count = computed(() => Number(this.qp()['count'] ?? 10));

  results = signal<IPost[]>([]);
  loading = signal(false);

  constructor() {
    effect(async () => {
      const q = this.query();
      const c = this.count();

      if (!q) {
        this.results.set([]);
        return;
      }

      this.loading.set(true);
      try {
        const data = await this.api.search(q, c).toPromise();
        this.results.set(data ?? []);

        // Actualizar meta tags después de obtener resultados
        this.updateMetaTags(q, data?.length ?? 0);
      } catch (err) {
        console.error('Error loading articles:', err);
      } finally {
        this.loading.set(false);
      }
    });
  }

  private updateMetaTags(query: string, resultsCount: number): void {
    const title = `Resultados para "${query}" | Ayuda de Redif`;
    const description = resultsCount > 0
      ? `Se encontraron ${resultsCount} resultados para "${query}". Encuentra respuestas a tus preguntas en Ayuda de Redif.`
      : `No se encontraron resultados para "${query}". Intenta con otros términos de búsqueda.`;
    const canonicalUrl = `${environment.appUrl}/search?q=${encodeURIComponent(query)}`;

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

    console.log(`🏷️ Meta tags actualizados para búsqueda: "${query}" (${resultsCount} resultados)`);
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
