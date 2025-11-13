import {
  Component,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { SupportBox } from '../../components/support-box/support-box';
import { SubcategoryResolverData } from '../../resolvers/subcategory.resolver';
import { SeoService } from '../../services/seo.service';
import {
  CategoryNode,
  LoadingState,
  EmptyState,
  PageHeader,
  urlToApiRole,
} from '../../shared';

@Component({
  selector: 'app-subcategory',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterLink,
    SupportBox,
    LoadingState,
    EmptyState,
    PageHeader,
  ],
  templateUrl: './subcategory.html',
  styleUrls: ['./subcategory.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Subcategory {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _seo = inject(SeoService);

  // Signals
  role = signal<string>('');
  subcategory = signal<CategoryNode | null>(null);
  isLoading = signal(false);

  constructor() {
    // Effect para obtener datos del resolver
    effect(() => {
      const resolvedData = this._route.snapshot.data[
        'subcategory'
      ] as SubcategoryResolverData | null;

      if (resolvedData) {
        console.log('✅ Sub-categoría cargada desde resolver (SSR)');
        this.role.set(resolvedData.role);
        this.subcategory.set(resolvedData.subcategory);
        this.isLoading.set(false);

        // Actualizar meta tags
        this.updateMetaTags(
          resolvedData.subcategory.title,
          resolvedData.subcategory.post.length
        );
      }
    });
  }

  // Método para actualizar meta tags
  private updateMetaTags(subcategoryTitle: string, postsCount: number): void {
    const roleUrl = this.role();
    this._seo.updateMetaTags({
      title: `${subcategoryTitle} | Ayuda de Redif`,
      description: `Encuentra ${postsCount} artículos sobre ${subcategoryTitle}.`,
      url: `/categories/${roleUrl}/${this.subcategory()?.id}`,
    });
  }

  // Método para obtener el nombre del role en formato de visualización
  getRoleName(): string {
    const current = this.role();
    return urlToApiRole(current) || current;
  }

  // Método para obtener la URL de retorno
  getBackUrl(): string {
    return `/categories/${this.role()}`;
  }
}
