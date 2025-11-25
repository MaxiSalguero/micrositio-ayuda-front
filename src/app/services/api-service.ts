import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IRelated, ITaxonomy, Category, IPost, Like, RootCategory, PageCategoryResponse, PagePostResponse } from '../shared';

/**
 * Servicio centralizado para todas las llamadas a la API
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _httpClient = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  /**
   * Realiza una búsqueda de posts
   * @param query - Término de búsqueda
   * @param count - Número de resultados a devolver
   * @returns Observable con array de posts que coinciden con la búsqueda
   */
  search(query: string, count: number): Observable<IPost[]> {
    return this._httpClient.get<IPost[]>(
      `${this.baseUrl}/search?q=${query}&count=${count}`
    );
  }

  /**
   * Crea un like/dislike en un post
   * @param postId - ID del post a valorar
   * @param value - true para like, false para dislike
   * @returns Observable con el like creado
   */
  createLike(postId: number, value: boolean): Observable<Like> {
    return this._httpClient.post<Like>(`${this.baseUrl}/posts/like`, {
      postId,
      value,
    });
  }

  // ========== NUEVOS ENDPOINTS PARA PATRÓN UNIFICADO ==========

  /**
   * Obtiene las categorías raíz del sistema (sin padre)
   * @returns Observable con array de categorías raíz
   */
  getRootCategories(): Observable<RootCategory[]> {
    return this._httpClient.get<RootCategory[]>(`${this.baseUrl}/categories/root`);
  }

  /**
   * Obtiene una categoría con su jerarquía completa de subcategorías y posts
   * @param id - ID de la categoría
   * @returns Observable con la estructura jerárquica completa de la categoría
   */
  getPageCategory(id: number): Observable<PageCategoryResponse> {
    return this._httpClient.get<PageCategoryResponse>(`${this.baseUrl}/pages/categories/${id}`);
  }

  /**
   * Obtiene un post con sus posts relacionados
   * @param id - ID del post
   * @returns Observable con el post y sus relacionados
   */
  getPagePost(id: number): Observable<PagePostResponse> {
    return this._httpClient.get<PagePostResponse>(`${this.baseUrl}/pages/posts/${id}`);
  }
}
