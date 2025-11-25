import {
  Component,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SupportBox } from '../../components/support-box/support-box';
import { SeoService } from '../../services/seo.service';
import {
  LoadingState,
  EmptyState,
  PageHeader,
  PageCategoryResponse,
  PageCategory,
  PagePost,
} from '../../shared';
import { MatListModule } from '@angular/material/list';
import { buildSlugId } from '../../shared/utils/slug.utils';

@Component({
  selector: 'app-categories',
  imports: [
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    RouterLink,
    SupportBox,
    LoadingState,
    EmptyState,
    PageHeader,
  ],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {
  private _route = inject(ActivatedRoute);
  private _seo = inject(SeoService);

  // Signals
  pageTitle = signal<string>('');
  categoryData = signal<PageCategoryResponse | null>(null);
  directPosts = signal<PagePost[]>([]);
  categories = signal<PageCategory[]>([]);
  isLoading = signal(false);

  @ViewChild(MatAccordion, { static: false }) accordion?: MatAccordion;

  // Signal reactivo para detectar cambios en route.data
  routeData = toSignal(this._route.data);

  // Exponer buildSlugId para el template
  buildSlugId = buildSlugId;

  constructor() {
    // Effect reactivo que se dispara cuando route.data cambia
    effect(() => {
      const data = this.routeData();
      const resolvedData = data?.['categories'] as PageCategoryResponse | null;

      if (resolvedData) {
        this.categoryData.set(resolvedData);
        this.pageTitle.set(resolvedData.title);
        this.directPosts.set(resolvedData.posts || []);
        this.categories.set(resolvedData.categories || []);
        this.isLoading.set(false);

        // Actualizar meta tags
        const totalContent = resolvedData.categories.length + resolvedData.posts.length;
        this.updateMetaTags(resolvedData.title, totalContent, buildSlugId(resolvedData.slug, resolvedData.id));
      }
    });
  }

  private updateMetaTags(pageTitle: string, categoriesCount: number, categorySlugId: string): void {
    this._seo.updateMetaTags({
      title: `${pageTitle} | Ayuda de Redif`,
      description: `Explora ${categoriesCount} elementos de ayuda. Encuentra respuestas a tus preguntas.`,
      url: `/categories/${categorySlugId}`,
    });
  }

  /**
   * Construye una ruta para navegar a una subcategoría
   */
  buildCategoryRoute(category: PageCategory): string[] {
    return ['/categories', buildSlugId(category.slug, category.id)];
  }

  /**
   * Construye una ruta para navegar a un post
   */
  buildPostRoute(post: PagePost): string[] {
    return ['/posts', buildSlugId(post.slug, post.id)];
  }
}
