import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SupportBox } from '../../components/support-box/support-box';
import { SearchBar } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-home',
  imports: [
    MatIconModule,
    MatButtonModule,
    SupportBox,
    SearchBar,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private _router = inject(Router);

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
}
