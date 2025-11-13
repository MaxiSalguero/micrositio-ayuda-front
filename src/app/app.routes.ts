import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Posts } from './pages/posts/posts';
import { Categories } from './pages/categories/categories';
import { Subcategory } from './pages/subcategory/subcategory';
import { SearchResults } from './pages/search-results/search-results';
import { postResolver } from './resolvers/post.resolver';
import { categoriesResolver } from './resolvers/categories.resolver';
import { subcategoryResolver } from './resolvers/subcategory.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'categories/:role',
    component: Categories,
    title: 'Categorías',
    resolve: { categories: categoriesResolver },
  },
  {
    path: 'posts/:postId',
    component: Posts,
    title: 'Artículo',
    resolve: {
      post: postResolver, // 🔥 NUEVO: Resolver se ejecuta antes de renderizar
    },
  },
  {
    path: 'search',
    component: SearchResults,
    title: 'Search Results',
  },
  {
    path: 'categories/:role/:subcategoryId',
    component: Subcategory,
    title: 'Sub-categoría',
    resolve: { subcategory: subcategoryResolver },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
