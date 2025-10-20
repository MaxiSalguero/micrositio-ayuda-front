import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-search-bar',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  private _router = inject(Router);

  formularioBusqueda: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioBusqueda = this.fb.group({
      busqueda: [''],
    });
  }

  send() {
    const query = this.formularioBusqueda.get('busqueda')?.value ?? '';
    if (query) {
      this._router.navigate(['/search'], {
        queryParams: { q: query, count: 5 },
      });
    }
  }
}
