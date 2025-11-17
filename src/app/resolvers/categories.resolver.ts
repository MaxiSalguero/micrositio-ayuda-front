import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/core';
import { ApiService } from '../services/api-service';
import { of, tap, catchError, switchMap, map } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Category, CategoryNode, ITaxonomy, urlToApiRole, isValidRoleSlug } from '../shared';
import { extractIdFromSlug } from '../shared/utils/slug.utils';

// Interface para el resultado del resolver
export interface CategoriesResolverData {
  role: string;
  pageTitle: string;  // Título dinámico del header
  categoryId?: number;  // ID de la categoría (si es una sub-categoría)
  categories: CategoryNode[];  // Categorías hijas a mostrar en acordeón
  directPosts?: any[];  // Posts directos cuando no hay sub-categorías (mostrar sin acordeón)
}

const CATEGORIES_KEY = (identifier: string) =>
  makeStateKey<CategoriesResolverData>(`categories-${identifier}`);

export const categoriesResolver: ResolveFn<CategoriesResolverData | null> = (
  route
) => {
  const apiService = inject(ApiService);
  const transferState = inject(TransferState);
  const router = inject(Router);

  const role = route.params['role'];
  const slugId = route.params['slugId'];

  // Validar que el role sea válido
  if (!role || !isValidRoleSlug(role)) {
    console.error('❌ Role inválido:', role);
    router.navigate(['/home']);
    return of(null);
  }

  // Determinar si se carga por slugId o por role
  if (slugId) {
    // Caso: Carga de sub-categoría por ID (extraer ID del slug)
    const categoryId = extractIdFromSlug(slugId);
    if (!categoryId) {
      console.error('❌ ID de categoría inválido en slugId:', slugId);
      router.navigate(['/home']);
      return of(null);
    }
    return loadCategoryById(categoryId, role, apiService, transferState, router);
  } else {
    // Caso: Carga de categorías principales por role
    return loadCategoryByRole(role, apiService, transferState, router);
  }
};

// Función auxiliar: Cargar categorías principales por role
function loadCategoryByRole(
  role: string,
  apiService: ApiService,
  transferState: TransferState,
  router: Router
) {
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

          // Si no hay categorías hijas, retornar posts directos
          if (children.length === 0) {
            const result: CategoriesResolverData = {
              role: apiRole,
              pageTitle: `Temas de ayuda para ${apiRole}`,
              categories: [],
              directPosts: parentCategory.post || [],
            };
            transferState.set(key, result);
            console.log('✅ Categorías guardadas en Transfer State (con posts directos)');
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
                    pageTitle: `Temas de ayuda para ${apiRole}`,
                    categories: categoryNodes,
                    directPosts: parentCategory.post || [],
                  };
                  transferState.set(key, result);
                  console.log(
                    '✅ Categorías con subcategorías guardadas en Transfer State:',
                    categoryNodes.length,
                    'subcategorías,',
                    (parentCategory.post || []).length,
                    'posts directos'
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
}

// Función auxiliar: Cargar sub-categoría por ID
function loadCategoryById(
  categoryId: number,
  role: string,
  apiService: ApiService,
  transferState: TransferState,
  router: Router
) {
  const key = CATEGORIES_KEY(`${role}-${categoryId}`);

  // 1. Intentar obtener datos del Transfer State
  const cachedData = transferState.get(key, null);

  if (cachedData) {
    console.log('📦 Usando sub-categoría del Transfer State (SSR) - ID:', categoryId);
    transferState.remove(key);
    return of(cachedData);
  }

  // 2. Si no hay datos, hacer peticiones (servidor o primera carga)
  console.log('🌐 Solicitando sub-categoría de la API - ID:', categoryId);

  return apiService.getCategoryById(categoryId).pipe(
    switchMap((subcategory) => {
      // Obtener la taxonomía para ver si esta sub-categoría tiene hijas
      return apiService.getTaxonomy().pipe(
        switchMap((items: ITaxonomy[]) => {
          // Filtrar las categorías nietas (hijas de esta sub-categoría)
          const children = items
            .filter((item) => item.parent?.id === subcategory.id)
            .map((item) => item.category)
            .filter(Boolean) as { id: number }[];

          // Si no hay categorías nietas, retornar posts directos
          if (children.length === 0) {
            const result: CategoriesResolverData = {
              role,
              pageTitle: subcategory.title,
              categoryId: subcategory.id,
              categories: [],  // Sin sub-categorías
              directPosts: subcategory.post || [],  // Posts directos
            };

            transferState.set(key, result);
            console.log('✅ Sub-categoría guardada en Transfer State (posts directos)');
            return of(result);
          }

          // Si hay nietas, hacer peticiones paralelas para obtenerlas
          const requests = children.map((child) =>
            apiService.getCategoryById(child.id)
          );

          return forkJoin(requests).pipe(
            map((childrenWithPosts) => {
              // Convertir las hijas a CategoryNode
              const childCategories: CategoryNode[] = childrenWithPosts.map(child => ({
                ...child,
                subcategories: [],
                hasChildren: false,
              }));

              const result: CategoriesResolverData = {
                role,
                pageTitle: subcategory.title,
                categoryId: subcategory.id,
                categories: childCategories,  // Subcategorías hijas
                directPosts: subcategory.post || [],  // Posts propios de la categoría actual
              };

              transferState.set(key, result);
              console.log(
                '✅ Sub-categoría con hijas y posts guardada en Transfer State:',
                childCategories.length,
                'hijas,',
                (subcategory.post || []).length,
                'posts directos'
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
}
