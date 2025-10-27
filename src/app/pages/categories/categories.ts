import {
  Component,
  inject,
  signal,
  effect,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser'; // 🔥 NUEVO
import { ApiService } from '../../services/api-service';
import { NavigationStateService } from '../../services/navigation-state.service';
import { Category } from '../../models/post.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // 🔥 NUEVO
import { SupportBox } from '../../components/support-box/support-box';
import { BackButton } from '../../components/back-button/back-button';
import { toSignal } from '@angular/core/rxjs-interop'; // 🔥 NUEVO
import { CategoriesResolverData } from '../../resolvers/categories.resolver'; // 🔥 NUEVO
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-categories',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule, // 🔥 NUEVO
    RouterLink,
    SupportBox,
    BackButton,
  ],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _apiService = inject(ApiService);
  private _navigationState = inject(NavigationStateService);
  private _meta = inject(Meta); // 🔥 NUEVO
  private _title = inject(Title); // 🔥 NUEVO

  // Signals
  selectedRole = signal<string>('');
  categories = signal<Category[]>([]);
  isLoading = signal(false);

  // Signal reactivo para los parámetros de la ruta
  private params = toSignal(this._route.params); // 🔥 NUEVO

  @ViewChild(MatAccordion, { static: false }) accordion?: MatAccordion;

  constructor() {
    // 🔥 NUEVO: Effect para obtener datos del resolver
    effect(() => {
      const resolvedData = this._route.snapshot.data[
        'categoriesData'
      ] as CategoriesResolverData | null;

      if (resolvedData) {
        console.log('✅ Categorías cargadas desde resolver (SSR)');
        this.selectedRole.set(this.getRoleFromApiRole(resolvedData.role));
        this.categories.set(resolvedData.categories);
        this.isLoading.set(false);

        // Actualizar estado global
        this._navigationState.updateFullState({
          selectedRole: resolvedData.role,
          categories: resolvedData.categories,
        });

        // Actualizar meta tags
        this.updateMetaTags(resolvedData.role, resolvedData.categories.length);
      }
    });

    // 🔥 NUEVO: Effect para manejar cambios en los parámetros de la ruta
    effect(() => {
      const currentParams = this.params();
      if (!currentParams) return;

      const role = currentParams['role'];
      if (!role) {
        this._router.navigate(['/home']);
        return;
      }

      // Solo cargar si NO hay datos del resolver
      const resolvedData = this._route.snapshot.data['categoriesData'];
      if (!resolvedData) {
        this.selectedRole.set(role);
        this.loadCategoriesForRole(role);
      }
    });
  }

  // 🔥 MODIFICADO: Método privado para cargar categorías (fallback)
  private loadCategoriesForRole(role: string): void {
    this.isLoading.set(true);

    // Mapear roles de URL a títulos de API
    const roleMap: { [key: string]: string } = {
      alumnos: 'Alumnos',
      profesores: 'Profesores',
      administracion: 'Administración',
    };

    const apiRole = roleMap[role];
    if (!apiRole) {
      console.error('Rol no válido:', role);
      this._router.navigate(['/home']);
      this.isLoading.set(false);
      return;
    }

    this._apiService.getCategoryByTitle(apiRole).subscribe({
      next: (parentCategory) => {
        this._apiService.getTaxonomy().subscribe({
          next: (items) => {
            const children = items
              .filter((item) => item.parent?.id === parentCategory.id)
              .map((item) => item.category)
              .filter(Boolean) as { id: number }[];

            const requests = children.map((child) =>
              this._apiService.getCategoryById(child.id)
            );

            if (requests.length === 0) {
              this.categories.set([]);
              this._navigationState.updateFullState({
                selectedRole: apiRole,
                categories: [],
              });
              this.isLoading.set(false);
              this.updateMetaTags(apiRole, 0);
              return;
            }

            import('rxjs').then(({ forkJoin }) => {
              forkJoin(requests).subscribe({
                next: (categoriesWithPosts: Category[]) => {
                  this.categories.set(categoriesWithPosts);

                  // Actualizar estado global
                  this._navigationState.updateFullState({
                    selectedRole: apiRole,
                    categories: categoriesWithPosts,
                  });

                  this.isLoading.set(false);
                  this.updateMetaTags(apiRole, categoriesWithPosts.length);
                },
                error: (err) => {
                  console.error('Error loading categories:', err);
                  this.isLoading.set(false);
                  this._router.navigate(['/home']);
                },
              });
            });
          },
          error: (err) => {
            console.error('Error loading taxonomy:', err);
            this.isLoading.set(false);
            this._router.navigate(['/home']);
          },
        });
      },
      error: (err) => {
        console.error('Error loading parent category:', err);
        this.isLoading.set(false);
        this._router.navigate(['/home']);
      },
    });
  }

  // 🔥 NUEVO: Método para actualizar meta tags
  private updateMetaTags(role: string, categoriesCount: number): void {
    const title = `Ayuda para ${role} | Ayuda de Redif`;
    this._title.setTitle(title);

    const description = `Explora ${categoriesCount} categorías de ayuda para ${role}. Encuentra respuestas a tus preguntas.`;

    const roleUrl = this.getRoleFromApiRole(role);
    const canonicalUrl = `${environment.appUrl}/categories/${roleUrl}`;

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
    this._meta.updateTag({ property: 'og:url', content: canonicalUrl }); // 🔥 URL canónica
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

    console.log('🏷️ Meta tags actualizados para:', role);
  }

  // 🔥 NUEVO: Método auxiliar para convertir apiRole a role de URL
  private getRoleFromApiRole(apiRole: string): string {
    const reverseRoleMap: { [key: string]: string } = {
      Alumnos: 'alumnos',
      Profesores: 'profesores',
      Administración: 'administracion',
    };
    return reverseRoleMap[apiRole] || apiRole.toLowerCase();
  }

  getRoleName(): string {
    const roleNames: { [key: string]: string } = {
      alumnos: 'Alumnos',
      profesores: 'Profesores',
      administracion: 'Administración',
    };
    const current = this.selectedRole();
    return roleNames[current] || current;
  }
}
