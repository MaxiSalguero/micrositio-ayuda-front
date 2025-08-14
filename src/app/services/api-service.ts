import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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
}
