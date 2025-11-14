import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'home',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'posts/:postId',
    renderMode: RenderMode.Server,
  },
  {
    path: 'categories/:role',
    renderMode: RenderMode.Server,
  },
  {
    path: 'search',
    renderMode: RenderMode.Client,
  },
  {
    path: 'categories/:role/:categoryId',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
