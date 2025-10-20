import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  effect,
  PLATFORM_ID,
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
import { SupportBox } from '../../components/support-box/support-box';
import { BackButton } from '../../components/back-button/back-button';
import { isPlatformBrowser } from '@angular/common';

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
    BackButton,
  ],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Posts {
  private platformId = inject(PLATFORM_ID);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _apiService = inject(ApiService);
  private _navigationState = inject(NavigationStateService);

  // Signals para el estado reactivo
  post = signal<IPost | null>(null);
  related = signal<Post[]>([]);
  isLoading = signal(true);
  isLiked = signal(false);
  backUrl = signal<string>('/home');

  // Signal reactivo para los parámetros de la ruta
  private params = toSignal(this._route.params);
  private queryParams = toSignal(this._route.queryParams);

  constructor() {
    // Effect para manejar cambios en los parámetros de la ruta
    effect(() => {
      const currentParams = this.params();
      const currentQueryParams = this.queryParams();
      const isEmptyObject = (obj: any) =>
        obj && typeof obj === 'object' && Object.keys(obj).length === 0;

      if (!currentParams) return;
      if (isEmptyObject(currentQueryParams)) {
        if (isPlatformBrowser(this.platformId)) {
          try {
            const qp = localStorage.getItem('queryParams');
            const parsedQp = qp ? JSON.parse(qp) : {};
            const query = parsedQp.q || '';
            const count = parsedQp.count || '';

            const url = `/search?q=${encodeURIComponent(query)}&count=${count}`;
            this.backUrl.set(url);
          } catch (error) {
            console.error(
              'Error parsing queryParams from localStorage:',
              error
            );
            this.backUrl.set('/home');
          }
        }
      }

      const currentPostId = Number(currentParams?.['postId']);
      if (!currentPostId || isNaN(currentPostId)) return;

      // Determinar la URL de regreso basada en query params
      if (currentQueryParams && currentQueryParams['role']) {
        this.backUrl.set(`/categories/${currentQueryParams['role']}`);
      } else if (this._navigationState.selectedRole()) {
        // Mapear roles de API a URLs
        const roleUrlMap: { [key: string]: string } = {
          Alumnos: 'alumnos',
          Profesores: 'profesores',
          Administración: 'administracion',
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
    const url = this.backUrl();
    console.log('Navigating back to:', url);
    this._router.navigateByUrl(url);
  }

  handleLike(value: boolean) {
    this._apiService.createLike(this.post()!.id, value).subscribe(() => {
      this.isLiked.set(true);
    });
  }
}
