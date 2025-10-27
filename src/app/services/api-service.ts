import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IRelated } from '../models/related.model';
import { ITaxonomy } from '../models/taxonomy.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _httpClient = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  getTitle(): Observable<string> {
    return this._httpClient.get(this.baseUrl, { responseType: 'text' });
  }

  getCategories(): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/categories`);
  }

  getCategoryByTitle(title: string): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/categories/category/${title}`);
  }

  getCategoryById(id: number): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/categories/${id}`);
  }

  getPostById(postId: number): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}/posts/${postId}`);
  }

  getRelated(): Observable<IRelated[]> {
    return this._httpClient.get<IRelated[]>(`${this.baseUrl}/related`);
  }

  getTaxonomy(): Observable<ITaxonomy[]> {
    return this._httpClient.get<ITaxonomy[]>(`${this.baseUrl}/taxonomy`);
  }

  search(query: string, count: number): Observable<any> {
    return this._httpClient.get<any>(
      `${this.baseUrl}/search?q=${query}&count=${count}`
    );
  }

  createLike(postId: number, value: boolean): Observable<any> {
    return this._httpClient.post<any>(`${this.baseUrl}/likes`, {
      post: postId,
      value,
    });
  }
}
