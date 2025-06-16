import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  title: string = 'cargando titulo...';

  private _apiService = inject(ApiService);

  ngOnInit(): void {
    this._apiService.getTitle().subscribe((data) => (this.title = data));
  }
}
