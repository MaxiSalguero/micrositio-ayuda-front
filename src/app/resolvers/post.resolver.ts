import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/core';
import { ApiService } from '../services/api-service';
import { of, tap, catchError } from 'rxjs';
import { IPost } from '../shared';

// Clave única para cada post en el Transfer State
const POST_KEY = (id: number) => makeStateKey<IPost>(`post-${id}`);

export const postResolver: ResolveFn<IPost | null> = (route) => {
  const apiService = inject(ApiService);
  const transferState = inject(TransferState);

  const postId = Number(route.params['postId']);

  // Validar que el ID sea válido
  if (!postId || isNaN(postId)) {
    console.error('❌ ID de post inválido:', route.params['postId']);
    return of(null);
  }

  const key = POST_KEY(postId);

  // 1. Intentar obtener datos del Transfer State (cliente)
  const cachedData = transferState.get(key, null);

  if (cachedData) {
    console.log('📦 Usando datos del Transfer State (SSR) - Post ID:', postId);
    transferState.remove(key); // Limpiar para futuras navegaciones
    return of(cachedData);
  }

  // 2. Si no hay datos, hacer petición (servidor o primera carga)
  console.log('🌐 Solicitando datos de la API - Post ID:', postId);
  return apiService.getPostById(postId).pipe(
    tap((data) => {
      if (data) {
        transferState.set(key, data);
        console.log('✅ Datos guardados en Transfer State');
      }
    }),
    catchError((error) => {
      console.error('❌ Error al cargar post:', error);
      return of(null);
    })
  );
};
