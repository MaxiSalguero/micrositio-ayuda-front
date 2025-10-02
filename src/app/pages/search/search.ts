import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../services/api-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [MatListModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private _route = inject(ActivatedRoute);
  private _apiService = inject(ApiService);

  // Signal reactivo para los parámetros de la ruta
  private queryParams = toSignal(this._route.queryParams);
  results: any[] = [];

  constructor() {}

  performSearch(query: string): void {
    this._apiService.search(query).subscribe((data) => {
      this.results = data;
    });
  }
}
