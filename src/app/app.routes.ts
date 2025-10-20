import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Posts } from './pages/posts/posts';
import { Categories } from './pages/categories/categories';
import { SearchResults } from './pages/search-results/search-results';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'categories/:role',
    component: Categories,
    title: 'Categorías',
  },
  {
    path: 'posts/:postId',
    component: Posts,
    title: 'Artículo',
  },
  {
    path: 'search',
    component: SearchResults,
    title: 'Search Results',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
