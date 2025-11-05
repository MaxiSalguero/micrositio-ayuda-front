import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeMarkdown',
  standalone: true
})
export class PipeMarkdownPipe implements PipeTransform {

  transform(value: string, maxLength: number = 150): string {
    if (!value) return '';

    // 1. Remover sintaxis de Markdown
    let plainText = value
      // Remover headers (##, ###, etc.)
      .replace(/^#{1,6}\s+/gm, '')
      // Remover bold/italic (**texto** o *texto*)
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remover links [texto](url)
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Remover listas (-, *, +, números)
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Remover saltos de línea múltiples
      .replace(/\n{2,}/g, ' ')
      // Remover saltos de línea simples
      .replace(/\n/g, ' ')
      // Remover espacios múltiples
      .replace(/\s{2,}/g, ' ')
      // Trim
      .trim();

    // 2. Limitar longitud
    if (plainText.length > maxLength) {
      plainText = plainText.substring(0, maxLength).trim() + '...';
    }

    return plainText;
  }

}