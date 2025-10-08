import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { NavigationStateService } from '../../services/navigation-state.service';
import { Category } from '../../models/post.model';
import { ITaxonomy } from '../../models/taxonomy.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { SupportBox } from '../../components/support-box/support-box';

@Component({
  selector: 'app-categories',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    RouterLink,
    SupportBox,
  ],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _apiService = inject(ApiService);
  private _navigationState = inject(NavigationStateService);

  // Signals
  selectedRole = signal<string>('');
  categories = signal<Category[]>([]);
  isLoading = signal(true);

  @ViewChild(MatAccordion, { static: false }) accordion?: MatAccordion;

  ngOnInit(): void {
    // Obtener el rol desde los parámetros de la ruta
    const role = this._route.snapshot.params['role'];
    if (!role) {
      this._router.navigate(['/home']);
      return;
    }

    this.selectedRole.set(role);
    this.loadCategoriesForRole(role);
  }

  private loadCategoriesForRole(role: string): void {
    this.isLoading.set(true);

    // Mapear roles de URL a títulos de API
    const roleMap: { [key: string]: string } = {
      'alumnos': 'Alumnos',
      'profesores': 'Profesores',
      'administracion': 'Administración'
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
          next: (items: ITaxonomy[]) => {
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
                categories: []
              });
              this.isLoading.set(false);
              return;
            }

            forkJoin(requests).subscribe({
              next: (categoriesWithPosts: Category[]) => {
                this.categories.set(categoriesWithPosts);

                // Actualizar estado global
                this._navigationState.updateFullState({
                  selectedRole: apiRole,
                  categories: categoriesWithPosts
                });

                this.isLoading.set(false);
              },
              error: (err) => {
                console.error('Error loading categories:', err);
                this.isLoading.set(false);
              },
            });
          },
          error: (err) => {
            console.error('Error loading taxonomy:', err);
            this.isLoading.set(false);
          },
        });
      },
      error: (err) => {
        console.error('Error loading parent category:', err);
        this.isLoading.set(false);
      },
    });
  }

  getRoleName(): string {
    const roleNames: { [key: string]: string } = {
      'alumnos': 'Alumnos',
      'profesores': 'Profesores',
      'administracion': 'Administración'
    };
    const current = this.selectedRole();
    return roleNames[current] || current;
  }
}