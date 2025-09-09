import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IRelated } from '../models/related.model';
import { ITaxonomy } from '../models/taxonomy.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = 'http://localhost:3000';
  private _httpClient = inject(HttpClient);

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
}
