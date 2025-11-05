import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

/**
 * Configuración para actualizar meta tags de SEO
 */
export interface SeoConfig {
  /** Título de la página */
  title: string;
  /** Descripción de la página */
  description: string;
  /** URL canónica (opcional, se genera automáticamente si no se provee) */
  url?: string;
  /** URL de imagen para Open Graph (opcional, usa logo por defecto) */
  image?: string;
  /** Tipo de contenido Open Graph (por defecto: 'website') */
  type?: 'website' | 'article';
  /** Palabras clave adicionales (opcional) */
  keywords?: string[];
}

/**
 * Servicio centralizado para gestión de meta tags SEO
 *
 * Este servicio encapsula toda la lógica de actualización de meta tags
 * para mejorar el SEO y la compartición en redes sociales (Open Graph, Twitter Cards).
 *
 * @example
 * ```typescript
 * constructor(private seo: SeoService) {
 *   this.seo.updateMetaTags({
 *     title: 'Mi Página | Ayuda de Redif',
 *     description: 'Descripción de mi página',
 *     type: 'article'
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private _meta = inject(Meta);
  private _title = inject(Title);

  /**
   * Imagen por defecto para Open Graph y Twitter Cards
   */
  private readonly DEFAULT_IMAGE = `${environment.appUrl}/images/redif_ar_logo.jpeg`;

  /**
   * Actualiza todos los meta tags de la página para SEO
   *
   * @param config - Configuración de meta tags
   */
  updateMetaTags(config: SeoConfig): void {
    const {
      title,
      description,
      url = this.getCurrentUrl(),
      image = this.DEFAULT_IMAGE,
      type = 'website',
      keywords = [],
    } = config;

    // Actualizar título de la página
    this._title.setTitle(title);

    // Meta tags básicos
    this._meta.updateTag({
      name: 'description',
      content: description,
    });

    if (keywords.length > 0) {
      this._meta.updateTag({
        name: 'keywords',
        content: keywords.join(', '),
      });
    }

    // Open Graph tags (Facebook, LinkedIn, etc.)
    this._meta.updateTag({ property: 'og:title', content: title });
    this._meta.updateTag({ property: 'og:description', content: description });
    this._meta.updateTag({ property: 'og:type', content: type });
    this._meta.updateTag({ property: 'og:url', content: url });
    this._meta.updateTag({ property: 'og:image', content: image });

    // Twitter Card tags
    const twitterCard = type === 'article' ? 'summary_large_image' : 'summary';
    this._meta.updateTag({ name: 'twitter:card', content: twitterCard });
    this._meta.updateTag({ name: 'twitter:title', content: title });
    this._meta.updateTag({ name: 'twitter:description', content: description });
    this._meta.updateTag({ name: 'twitter:image', content: image });

    console.log('🏷️ Meta tags actualizados:', { title, url, type });
  }

  /**
   * Actualiza solo el título de la página
   *
   * @param title - Nuevo título
   */
  updateTitle(title: string): void {
    this._title.setTitle(title);
  }

  /**
   * Actualiza solo la descripción
   *
   * @param description - Nueva descripción
   */
  updateDescription(description: string): void {
    this._meta.updateTag({
      name: 'description',
      content: description,
    });
  }

  /**
   * Obtiene la URL actual completa de la aplicación
   *
   * @returns URL completa (ej: https://ayuda.redif.ar/posts/123)
   */
  private getCurrentUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    // Fallback para SSR
    return environment.appUrl;
  }

  /**
   * Genera una descripción truncada desde un contenido largo
   *
   * @param content - Contenido completo
   * @param maxLength - Longitud máxima (por defecto 160 caracteres, óptimo para SEO)
   * @returns Descripción truncada con "..."
   */
  generateDescription(content: string, maxLength: number = 160): string {
    const cleanContent = content.replace(/\s+/g, ' ').trim();
    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }
    return cleanContent.substring(0, maxLength).trim() + '...';
  }
}
