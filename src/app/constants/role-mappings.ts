/**
 * Role Mappings - Configuración centralizada de roles del sistema
 *
 * Este archivo centraliza todos los mapeos entre URLs y títulos de API
 * para evitar duplicación de código en múltiples archivos.
 */

/**
 * Mapeo de roles: URL slug -> Título API
 *
 * @example
 * - URL: /categories/alumnos -> API title: "Alumnos"
 * - URL: /categories/profesores -> API title: "Profesores"
 */
export const ROLE_MAPPINGS = {
  alumnos: 'Alumnos',
  profesores: 'Profesores',
  administracion: 'Administración',
} as const;

/**
 * Tipo de las claves del mapeo (slugs de URL)
 */
export type RoleUrlSlug = keyof typeof ROLE_MAPPINGS;

/**
 * Tipo de los valores del mapeo (títulos de API)
 */
export type RoleApiTitle = (typeof ROLE_MAPPINGS)[RoleUrlSlug];

/**
 * Convierte un slug de URL a título de API
 *
 * @param urlSlug - Slug de la URL (ej: "alumnos")
 * @returns Título de API (ej: "Alumnos") o null si no existe
 *
 * @example
 * urlToApiRole('alumnos') // returns 'Alumnos'
 * urlToApiRole('invalid') // returns null
 */
export function urlToApiRole(urlSlug: string): string | null {
  return ROLE_MAPPINGS[urlSlug as RoleUrlSlug] ?? null;
}

/**
 * Convierte un título de API a slug de URL
 *
 * @param apiTitle - Título de API (ej: "Alumnos")
 * @returns Slug de URL (ej: "alumnos") o null si no existe
 *
 * @example
 * apiToUrlRole('Alumnos') // returns 'alumnos'
 * apiToUrlRole('Invalid') // returns null
 */
export function apiToUrlRole(apiTitle: string): string | null {
  const entry = Object.entries(ROLE_MAPPINGS).find(
    ([_, api]) => api === apiTitle
  );
  return entry ? entry[0] : null;
}

/**
 * Valida si un slug de URL es válido
 *
 * @param urlSlug - Slug a validar
 * @returns true si el slug existe en el mapeo
 *
 * @example
 * isValidRoleSlug('alumnos') // returns true
 * isValidRoleSlug('invalid') // returns false
 */
export function isValidRoleSlug(urlSlug: string): urlSlug is RoleUrlSlug {
  return urlSlug in ROLE_MAPPINGS;
}

/**
 * Obtiene todos los slugs de URL válidos
 *
 * @returns Array de slugs válidos
 *
 * @example
 * getAllRoleSlugs() // returns ['alumnos', 'profesores', 'administracion']
 */
export function getAllRoleSlugs(): RoleUrlSlug[] {
  return Object.keys(ROLE_MAPPINGS) as RoleUrlSlug[];
}

/**
 * Obtiene todos los títulos de API válidos
 *
 * @returns Array de títulos de API
 *
 * @example
 * getAllRoleTitles() // returns ['Alumnos', 'Profesores', 'Administración']
 */
export function getAllRoleTitles(): RoleApiTitle[] {
  return Object.values(ROLE_MAPPINGS);
}
