import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/core';
import { ApiService } from '../services/api-service';
import { of, tap, catchError, switchMap, map } from 'rxjs';
import { forkJoin } from 'rxjs';
import { CategoryNode, ITaxonomy } from '../shared';

// Interface para el resultado del resolver
export interface SubcategoryResolverData {
  role: string;
  subcategory: CategoryNode;
}

const SUBCATEGORY_KEY = (subcategoryId: string) =>
  makeStateKey<SubcategoryResolverData>(`subcategory-${subcategoryId}`);

export const subcategoryResolver: ResolveFn<SubcategoryResolverData | null> = (
  route
) => {
  const apiService = inject(ApiService);
  const transferState = inject(TransferState);
  const router = inject(Router);

  const subcategoryId = route.params['subcategoryId'];
  const role = route.params['role'];

  // Validar que los parámetros sean válidos
  if (!subcategoryId || !role) {
    console.error('❌ Parámetros inválidos:', { subcategoryId, role });
    router.navigate(['/home']);
    return of(null);
  }

  const key = SUBCATEGORY_KEY(subcategoryId);

  // 1. Intentar obtener datos del Transfer State
  const cachedData = transferState.get(key, null);

  if (cachedData) {
    console.log('📦 Usando sub-categoría del Transfer State (SSR) - ID:', subcategoryId);
    transferState.remove(key);
    return of(cachedData);
  }

  // 2. Si no hay datos, hacer peticiones (servidor o primera carga)
  console.log('🌐 Solicitando sub-categoría de la API - ID:', subcategoryId);

  return apiService.getCategoryById(Number(subcategoryId)).pipe(
    switchMap((subcategory) => {
      // Obtener la taxonomía para ver si esta sub-categoría tiene hijas
      return apiService.getTaxonomy().pipe(
        switchMap((items: ITaxonomy[]) => {
          // Filtrar las categorías nietas (hijas de esta sub-categoría)
          const children = items
            .filter((item) => item.parent?.id === subcategory.id)
            .map((item) => item.category)
            .filter(Boolean) as { id: number }[];

          // Si no hay categorías nietas, retornar la sub-categoría tal cual
          if (children.length === 0) {
            const categoryNode: CategoryNode = {
              ...subcategory,
              subcategories: [],
              hasChildren: false,
            };

            const result: SubcategoryResolverData = {
              role,
              subcategory: categoryNode,
            };

            transferState.set(key, result);
            console.log('✅ Sub-categoría guardada en Transfer State (sin nietas)');
            return of(result);
          }

          // Si hay nietas, hacer peticiones paralelas para obtenerlas
          const requests = children.map((child) =>
            apiService.getCategoryById(child.id)
          );

          return forkJoin(requests).pipe(
            map((childrenWithPosts) => {
              const subcategories: CategoryNode[] = childrenWithPosts.map(child => ({
                ...child,
                subcategories: [],
                hasChildren: false,
              }));

              const categoryNode: CategoryNode = {
                ...subcategory,
                subcategories,
                hasChildren: true,
              };

              const result: SubcategoryResolverData = {
                role,
                subcategory: categoryNode,
              };

              transferState.set(key, result);
              console.log(
                '✅ Sub-categoría con nietas guardada en Transfer State:',
                subcategories.length
              );
              return result;
            })
          );
        })
      );
    }),
    catchError((error) => {
      console.error('❌ Error al cargar sub-categoría:', error);
      router.navigate(['/categories', role]);
      return of(null);
    })
  );
};
