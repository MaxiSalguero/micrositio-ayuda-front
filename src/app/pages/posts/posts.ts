import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  effect
} from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { NavigationStateService } from '../../services/navigation-state.service';
import { IPost } from '../../models/post.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { IRelated, Post } from '../../models/related.model';
import { MarkdownComponent } from 'ngx-markdown';
import { toSignal } from '@angular/core/rxjs-interop';

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
  ],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Posts {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _apiService = inject(ApiService);
  private _navigationState = inject(NavigationStateService);

  // Signals para el estado reactivo
  post = signal<IPost | null>(null);
  related = signal<Post[]>([]);
  isLoading = signal(true);
  backUrl = signal<string>('/home');

  // Signal reactivo para los parámetros de la ruta
  private params = toSignal(this._route.params);
  private queryParams = toSignal(this._route.queryParams);

  constructor() {
    // Effect para manejar cambios en los parámetros de la ruta
    effect(() => {
      const currentParams = this.params();
      const currentQueryParams = this.queryParams();

      if (!currentParams) return;

      const currentPostId = Number(currentParams['postId']);
      if (!currentPostId || isNaN(currentPostId)) return;

      // Determinar la URL de regreso basada en query params
      if (currentQueryParams && currentQueryParams['role']) {
        this.backUrl.set(`/categories/${currentQueryParams['role']}`);
      } else if (this._navigationState.selectedRole()) {
        // Mapear roles de API a URLs
        const roleUrlMap: { [key: string]: string } = {
          'Alumnos': 'alumnos',
          'Profesores': 'profesores',
          'Administración': 'administracion'
        };
        const urlRole = roleUrlMap[this._navigationState.selectedRole()!];
        if (urlRole) {
          this.backUrl.set(`/categories/${urlRole}`);
        }
      }

      this.isLoading.set(true);

      // Cargar post
      this._apiService.getPostById(currentPostId).subscribe({
        next: (data: IPost) => {
          this.post.set(data);
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('Error loading post:', err);
          this.isLoading.set(false);
        },
      });

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

  goBack(): void {
    this._router.navigateByUrl(this.backUrl());
  }
}
