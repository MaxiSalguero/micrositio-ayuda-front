import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/core';
import { ApiService } from '../services/api-service';
import { of, tap, catchError } from 'rxjs';
import { PageCategoryResponse } from '../shared';
import { extractIdFromSlug } from '../shared/utils/slug.utils';

const CATEGORY_KEY = (id: number) =>
  makeStateKey<PageCategoryResponse>(`category-${id}`);

/**
 * Resolver simplificado para categorías
 * Carga una categoría por su ID con toda su jerarquía de subcategorías y posts
 */
export const categoriesResolver: ResolveFn<PageCategoryResponse | null> = (
  route
) => {
  const apiService = inject(ApiService);
  const transferState = inject(TransferState);
  const router = inject(Router);

  const slugId = route.params['slugId'];

  // Extraer ID del parámetro slug-id
  const categoryId = extractIdFromSlug(slugId);

  if (!categoryId) {
    console.error('❌ ID de categoría inválido en slugId:', slugId);
    router.navigate(['/home']);
    return of(null);
  }

  const key = CATEGORY_KEY(categoryId);

  // 1. Intentar obtener datos del Transfer State (SSR)
  const cachedData = transferState.get(key, null);

  if (cachedData) {
    console.log('📦 Usando categoría del Transfer State (SSR) - ID:', categoryId);
    transferState.remove(key);
    return of(cachedData);
  }

  // 2. Si no hay datos en caché, hacer petición a la API
  console.log('🌐 Solicitando categoría de la API - ID:', categoryId);

  return apiService.getPageCategory(categoryId).pipe(
    tap((data) => {
      transferState.set(key, data);
      console.log('✅ Categoría guardada en Transfer State:', data.title);
    }),
    catchError((error) => {
      console.error('❌ Error al cargar categoría:', error);
      router.navigate(['/home']);
      return of(null);
    })
  );
};
