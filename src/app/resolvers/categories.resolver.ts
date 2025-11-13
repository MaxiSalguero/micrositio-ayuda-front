import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/core';
import { ApiService } from '../services/api-service';
import { of, tap, catchError, switchMap, map } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Category, CategoryNode, ITaxonomy, urlToApiRole, isValidRoleSlug } from '../shared';

// Interface para el resultado del resolver
export interface CategoriesResolverData {
  role: string;
  categories: CategoryNode[];  // Ahora usa CategoryNode para soportar subcategories
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

  // Validar que el role sea válido
  if (!role || !isValidRoleSlug(role)) {
    console.error('❌ Role inválido:', role);
    router.navigate(['/home']);
    return of(null);
  }

  const apiRole = urlToApiRole(role)!;
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
            switchMap((categoriesWithPosts: Category[]) => {
              // Para cada categoría hija, buscar sus propias hijas (nietas)
              const categoryNodesRequests = categoriesWithPosts.map((childCategory) => {
                // Buscar nietas de esta categoría hija en la taxonomía
                const grandchildren = items
                  .filter((item) => item.parent?.id === childCategory.id)
                  .map((item) => item.category)
                  .filter(Boolean) as { id: number }[];

                // Si no tiene nietas, retornar la categoría tal cual
                if (grandchildren.length === 0) {
                  const categoryNode: CategoryNode = {
                    ...childCategory,
                    subcategories: [],
                    hasChildren: false,
                  };
                  return of(categoryNode);
                }

                // Si tiene nietas, hacer peticiones paralelas para obtenerlas
                const grandchildrenRequests = grandchildren.map((grandchild) =>
                  apiService.getCategoryById(grandchild.id)
                );

                return forkJoin(grandchildrenRequests).pipe(
                  map((grandchildrenWithPosts: Category[]) => {
                    // Convertir las nietas a CategoryNode
                    const subcategories: CategoryNode[] = grandchildrenWithPosts.map(gc => ({
                      ...gc,
                      subcategories: [],
                      hasChildren: false,
                    }));

                    const categoryNode: CategoryNode = {
                      ...childCategory,
                      subcategories,
                      hasChildren: true,
                    };
                    return categoryNode;
                  })
                );
              });

              // Ejecutar todas las peticiones de nietas en paralelo
              return forkJoin(categoryNodesRequests).pipe(
                map((categoryNodes: CategoryNode[]) => {
                  const result: CategoriesResolverData = {
                    role: apiRole,
                    categories: categoryNodes,
                  };
                  transferState.set(key, result);
                  console.log(
                    '✅ Categorías con subcategorías guardadas en Transfer State:',
                    categoryNodes.length
                  );
                  return result;
                })
              );
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
