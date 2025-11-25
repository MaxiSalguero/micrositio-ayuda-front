import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  effect,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MarkdownComponent } from 'ngx-markdown';
import { toSignal } from '@angular/core/rxjs-interop';
import { SupportBox } from '../../components/support-box/support-box';
import { SeoService } from '../../services/seo.service';
import {
  PagePostResponse,
  PagePost,
  LoadingState,
  EmptyState,
  PageHeader,
} from '../../shared';
import { buildSlugId, extractIdFromSlug } from '../../shared/utils/slug.utils';

@Component({
  selector: 'app-posts',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MarkdownComponent,
    SupportBox,
    LoadingState,
    EmptyState,
    PageHeader,
  ],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Posts {
  private _route = inject(ActivatedRoute);
  private _apiService = inject(ApiService);
  private _seo = inject(SeoService);

  // Signals para el estado reactivo
  post = signal<PagePostResponse | null>(null);
  related = signal<PagePost[]>([]);
  isLoading = signal(false);
  isLiked = signal(false);

  // Signal reactivo para detectar cambios en route.data
  routeData = toSignal(this._route.data);

  // Exponer buildSlugId para el template
  buildSlugId = buildSlugId;

  constructor() {
    // Effect reactivo que se dispara cuando route.data cambia
    effect(() => {
      const data = this.routeData();
      const resolvedData = data?.['post'] as PagePostResponse | null;

      if (resolvedData) {
        console.log('✅ Post cargado desde resolver');
        this.post.set(resolvedData);
        this.related.set(resolvedData.related || []);
        this.isLoading.set(false);

        // Actualizar meta tags para SEO
        this.updateMetaTags(resolvedData);
      }
    });
  }

  // Método para actualizar meta tags
  private updateMetaTags(post: PagePostResponse): void {
    const slugId = buildSlugId(post.slug, post.id);
    this._seo.updateMetaTags({
      title: `${post.title} | Ayuda de Redif`,
      description: this._seo.generateDescription(post.content),
      url: `/posts/${slugId}`,
      type: 'article',
    });
  }

  handleLike(value: boolean) {
    this._apiService.createLike(this.post()!.id, value).subscribe(() => {
      this.isLiked.set(true);
    });
  }
}
