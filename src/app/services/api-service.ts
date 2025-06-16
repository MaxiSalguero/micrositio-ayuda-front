import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = 'http://localhost:3000';
  private _httpClient = inject(HttpClient);

  // Forma menos recomendada en Angular (Promises)

  /*   async getTitle(): Promise<string> {
    const response = await firstValueFrom(
      this._httpClient.get(this.baseUrl, { responseType: 'text' })
    );
    return response;
  } */

  // Forma mas recomendada en Angular (Observables)
  getTitle(): Observable<string> {
    return this._httpClient.get(this.baseUrl, { responseType: 'text' });
  }
}
