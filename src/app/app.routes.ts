import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Posts } from './pages/posts/posts';
import { Categories } from './pages/categories/categories';
import { SearchResults } from './pages/search-results/search-results';
import { postResolver } from './resolvers/post.resolver';
import { categoriesResolver } from './resolvers/categories.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'categories/:slugId',
    component: Categories,
    title: 'Categoría',
    resolve: { categories: categoriesResolver },
  },
  {
    path: 'posts/:slugId',
    component: Posts,
    title: 'Artículo',
    resolve: {
      post: postResolver,
    },
  },
  {
    path: 'search',
    component: SearchResults,
    title: 'Search Results',
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
