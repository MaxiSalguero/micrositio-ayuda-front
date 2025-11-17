/**
 * Utilidades para manejo de slugs con patrón {slug}-{id}
 *
 * Ejemplos:
 * - "introduccion-a-angular-42" → ID: 42
 * - buildSlugId("introduccion-a-angular", 42) → "introduccion-a-angular-42"
 */

/**
 * Extrae el ID numérico de un string con formato {slug}-{id}
 *
 * @param slugId String con formato "slug-texto-aqui-123"
 * @returns El ID numérico o null si no es válido
 *
 * @example
 * extractIdFromSlug("introduccion-a-angular-42") // 42
 * extractIdFromSlug("categoria-principal-7") // 7
 * extractIdFromSlug("invalid") // null
 */
export function extractIdFromSlug(slugId: string): number | null {
  if (!slugId || typeof slugId !== 'string') {
    return null;
  }

  // El ID está al final después del último guión
  const lastDashIndex = slugId.lastIndexOf('-');

  if (lastDashIndex === -1) {
    // No hay guión, podría ser solo un ID numérico (retrocompat limitada)
    const id = Number(slugId);
    return !isNaN(id) && id > 0 ? id : null;
  }

  const idPart = slugId.substring(lastDashIndex + 1);
  const id = Number(idPart);

  return !isNaN(id) && id > 0 ? id : null;
}

/**
 * Construye un string con formato {slug}-{id} para usar en rutas
 *
 * @param slug Slug del contenido (viene de la API)
 * @param id ID numérico del contenido
 * @returns String formateado para URL
 *
 * @example
 * buildSlugId("introduccion-a-angular", 42) // "introduccion-a-angular-42"
 * buildSlugId("categoria-principal", 7) // "categoria-principal-7"
 */
export function buildSlugId(slug: string, id: number): string {
  if (!slug || !id || id <= 0) {
    throw new Error(`buildSlugId: slug y id son requeridos (slug: "${slug}", id: ${id})`);
  }

  // El slug de la API ya viene formateado (URL-friendly)
  // Solo concatenamos con el ID
  return `${slug}-${id}`;
}
