import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IRelated, ITaxonomy, Category, IPost, Like } from '../shared';

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
   * Obtiene el título de la aplicación
   * @returns Observable con el título como string
   */
  getTitle(): Observable<string> {
    return this._httpClient.get(this.baseUrl, { responseType: 'text' });
  }

  /**
   * Obtiene todas las categorías
   * @returns Observable con array de categorías
   */
  getCategories(): Observable<Category[]> {
    return this._httpClient.get<Category[]>(`${this.baseUrl}/categories`);
  }

  /**
   * Obtiene una categoría por título
   * @param title - Título de la categoría a buscar
   * @returns Observable con la categoría encontrada
   */
  getCategoryByTitle(title: string): Observable<Category> {
    return this._httpClient.get<Category>(`${this.baseUrl}/categories/category/${title}`);
  }

  /**
   * Obtiene una categoría por ID
   * @param id - ID de la categoría a buscar
   * @returns Observable con la categoría encontrada
   */
  getCategoryById(id: number): Observable<Category> {
    return this._httpClient.get<Category>(`${this.baseUrl}/categories/${id}`);
  }

  /**
   * Obtiene un post por ID
   * @param postId - ID del post a buscar
   * @returns Observable con el post encontrado
   */
  getPostById(postId: number): Observable<IPost> {
    return this._httpClient.get<IPost>(`${this.baseUrl}/posts/${postId}`);
  }

  /**
   * Obtiene posts relacionados
   * @returns Observable con array de posts relacionados
   */
  getRelated(): Observable<IRelated[]> {
    return this._httpClient.get<IRelated[]>(`${this.baseUrl}/related`);
  }

  /**
   * Obtiene la taxonomía de categorías (relaciones padre-hijo)
   * @returns Observable con array de taxonomías
   */
  getTaxonomy(): Observable<ITaxonomy[]> {
    return this._httpClient.get<ITaxonomy[]>(`${this.baseUrl}/taxonomy`);
  }

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
    return this._httpClient.post<Like>(`${this.baseUrl}/likes`, {
      post: postId,
      value,
    });
  }
}
