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
  IPost,
  IRelated,
  Post,
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
  post = signal<IPost | null>(null);
  related = signal<Post[]>([]);
  isLoading = signal(false);
  isLiked = signal(false);

  // Signal reactivo para los parámetros de la ruta
  private params = toSignal(this._route.params);

  // Exponer buildSlugId para el template
  buildSlugId = buildSlugId;

  constructor() {
    // 🔥 NUEVO: Effect para obtener datos del resolver
    effect(() => {
      const resolvedData = this._route.snapshot.data['post'];
      if (resolvedData) {
        console.log('✅ Post cargado desde resolver (SSR)');
        this.post.set(resolvedData);
        this.isLoading.set(false);

        // 🔥 NUEVO: Actualizar meta tags para SEO
        this.updateMetaTags(resolvedData);
      }
    });

    // Effect para manejar cambios en los parámetros de la ruta
    effect(() => {
      const currentParams = this.params();
      if (!currentParams) return;

      const slugId = currentParams['slugId'];
      const currentPostId = extractIdFromSlug(slugId);
      if (!currentPostId) return;

      // Solo cargar si NO hay datos del resolver
      const currentPost = this.post();
      if (!currentPost || currentPost.id !== currentPostId) {
        this.isLoading.set(true);

        this._apiService.getPostById(currentPostId).subscribe({
          next: (data: IPost) => {
            this.post.set(data);
            this.isLoading.set(false);
            this.updateMetaTags(data);
          },
          error: (err: any) => {
            console.error('Error loading post:', err);
            this.isLoading.set(false);
          },
        });
      }

      // Cargar posts relacionados
      this._apiService.getRelated().subscribe({
        next: (data: IRelated[]) => {
          const relatedPosts = data
            .filter((item) => item.post.id === currentPostId)
            .map((item) => item.related);
          this.related.set(relatedPosts);
        },
        error: (err: any) => console.error('Error loading related posts:', err),
      });
    });
  }

  // 🔥 NUEVO: Método para actualizar meta tags
  private updateMetaTags(post: IPost): void {
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
