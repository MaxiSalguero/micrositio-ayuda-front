import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

/**
 * Componente reutilizable para mostrar tarjeta de artículo/post
 *
 * @example
 * ```html
 * <app-article-card
 *   [title]="post.title"
 *   [excerpt]="post.content | pipeMarkdown:150"
 *   [category]="post.category?.title"
 *   (cardClick)="navigateToPost(post.id)">
 * </app-article-card>
 * ```
 */
@Component({
  selector: 'app-article-card',
  imports: [MatCardModule, MatChipsModule],
  templateUrl: './article-card.html',
  styleUrl: './article-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleCard {
  /**
   * Título del artículo
   */
  @Input({ required: true }) title!: string;

  /**
   * Extracto o resumen del artículo
   */
  @Input() excerpt?: string;

  /**
   * Categoría del artículo (opcional)
   */
  @Input() category?: string;

  /**
   * Evento emitido al hacer clic en la tarjeta
   */
  @Output() cardClick = new EventEmitter<void>();

  onCardClick(): void {
    this.cardClick.emit();
  }
}
