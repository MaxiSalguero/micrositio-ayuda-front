import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/core';
import { ApiService } from '../services/api-service';
import { Category } from '../models/post.model';
import { ITaxonomy } from '../models/taxonomy.model';
import { of, tap, catchError, switchMap, map } from 'rxjs';
import { forkJoin } from 'rxjs';

// Interface para el resultado del resolver
export interface CategoriesResolverData {
  role: string;
  categories: Category[];
}

const CATEGORIES_KEY = (role: string) =>
  makeStateKey<CategoriesResolverData>(`categories-${role}`);

export const categoriesResolver: ResolveFn<CategoriesResolverData | null> = (
  route
) => {
  const apiService = inject(ApiService);
  const transferState = inject(TransferState);
  const router = inject(Router);

  const role = route.params['role'];

  // Mapear roles de URL a títulos de API
  const roleMap: { [key: string]: string } = {
    alumnos: 'Alumnos',
    profesores: 'Profesores',
    administracion: 'Administración',
  };

  // Validar que el role sea válido
  if (!role || !roleMap[role]) {
    console.error('❌ Role inválido:', role);
    router.navigate(['/home']);
    return of(null);
  }

  const apiRole = roleMap[role];
  const key = CATEGORIES_KEY(role);

  // 1. Intentar obtener datos del Transfer State
  const cachedData = transferState.get(key, null);

  if (cachedData) {
    console.log('📦 Usando categorías del Transfer State (SSR) - Role:', role);
    transferState.remove(key);
    return of(cachedData);
  }

  // 2. Si no hay datos, hacer peticiones (servidor o primera carga)
  console.log('🌐 Solicitando categorías de la API - Role:', role);

  return apiService.getCategoryByTitle(apiRole).pipe(
    switchMap((parentCategory) => {
      // Obtener la taxonomía
      return apiService.getTaxonomy().pipe(
        switchMap((items: ITaxonomy[]) => {
          // Filtrar las categorías hijas
          const children = items
            .filter((item) => item.parent?.id === parentCategory.id)
            .map((item) => item.category)
            .filter(Boolean) as { id: number }[];

          // Si no hay categorías hijas, retornar array vacío
          if (children.length === 0) {
            const result: CategoriesResolverData = {
              role: apiRole,
              categories: [],
            };
            transferState.set(key, result);
            console.log('✅ Categorías guardadas en Transfer State (vacío)');
            return of(result);
          }

          // Hacer peticiones paralelas para obtener cada categoría con sus posts
          const requests = children.map((child) =>
            apiService.getCategoryById(child.id)
          );

          return forkJoin(requests).pipe(
            map((categoriesWithPosts: Category[]) => {
              const result: CategoriesResolverData = {
                role: apiRole,
                categories: categoriesWithPosts,
              };
              transferState.set(key, result);
              console.log(
                '✅ Categorías guardadas en Transfer State:',
                categoriesWithPosts.length
              );
              return result;
            })
          );
        })
      );
    }),
    catchError((error) => {
      console.error('❌ Error al cargar categorías:', error);
      router.navigate(['/home']);
      return of(null);
    })
  );
};
