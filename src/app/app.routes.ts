import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Ssr } from './pages/ssr/ssr';
import { Material } from './pages/material/material';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'ssr', component: Ssr },
  { path: 'material', component: Material },
  { path: '**', redirectTo: '', pathMatch: 'full'},
];
