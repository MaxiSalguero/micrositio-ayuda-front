/**
 * Modelos para las respuestas de los endpoints /pages/*
 */

/**
 * Respuesta del endpoint GET /categories/root
 * Categorías raíz del sistema (sin padre)
 */
export interface RootCategory {
  id: number;
  title: string;
  slug: string;
}

/**
 * Post simplificado usado en respuestas de páginas
 */
export interface PagePost {
  id: number;
  title: string;
  slug: string;
}

/**
 * Categoría en la respuesta jerárquica de /pages/categories/:id
 * Estructura recursiva que soporta múltiples niveles de anidación
 */
export interface PageCategory {
  id: number;
  title: string;
  slug: string;
  posts: PagePost[];
  categories: PageCategory[];  // Recursivo para soporte de N niveles
}

/**
 * Respuesta completa del endpoint GET /pages/categories/:id
 */
export interface PageCategoryResponse {
  id: number;
  title: string;
  slug: string;
  posts: PagePost[];
  categories: PageCategory[];
}

/**
 * Respuesta del endpoint GET /pages/posts/:id
 */
export interface PagePostResponse {
  id: number;
  title: string;
  slug: string;
  content: string;
  related: PagePost[];
}
