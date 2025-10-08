import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-support-box-button',
  imports: [MatCardModule],
  templateUrl: './support-box-button.html',
  styleUrl: './support-box-button.scss',
})
export class SupportBoxButton {
  @Input() ctaUrl: string = "url('/images/icon-support.svg')";
  @Input() ctaHref = '#';
  @Input() ctaTitle?: string;
  @Input() ctaSubtitle?: string;
}
