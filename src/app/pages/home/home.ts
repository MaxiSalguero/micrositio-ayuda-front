import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SupportBox } from '../../components/support-box/support-box';

@Component({
  selector: 'app-home',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink,
    SupportBox,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private _router = inject(Router);
  formularioBusqueda: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formularioBusqueda = this.fb.group({
      busqueda: [''],
    });
  }

  handleParent(role: string): void {
    const roleRoutes: { [key: string]: string } = {
      Alumnos: 'alumnos',
      Profesores: 'profesores',
      Administración: 'administracion',
    };

    const routeRole = roleRoutes[role];
    if (routeRole) {
      this._router.navigate(['/categories', routeRole]);
    }
  }

  send() {
    const query = this.formularioBusqueda.value.busqueda;
    this._router.navigate([`/search?q=${query}`]);
  }
}
