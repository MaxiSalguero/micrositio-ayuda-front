import {
  Component,
  inject,
  viewChild,
  ChangeDetectionStrategy,
  effect,
  signal,
} from '@angular/core';
import { ApiService } from '../../services/api-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { ITaxonomy } from '../../models/taxonomy.model';
import { Category } from '../../models/post.model';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  category_parent = signal(false);
  parent_value = signal<string>('');
  category = signal<Category | null>(null);
  taxonomy = signal<Category[]>([]);

  private _apiService = inject(ApiService);

  accordion = viewChild.required(MatAccordion);

  constructor() {
    effect(() => {
      const value = this.parent_value();
      if (!value) return;

      this._apiService.getCategoryByTitle(value).subscribe((cat) => {
        this._apiService.getTaxonomy().subscribe({
          next: (items: ITaxonomy[]) => {
            const children = items
              .filter((item) => item.parent.id === cat.id)
              .map((item) => item.category);

            const requests = children.map((child) =>
              this._apiService.getCategoryById(child.id)
            );

            forkJoin(requests).subscribe({
              next: (categoriesWithPosts: Category[]) => {
                this.taxonomy.set(categoriesWithPosts);
              },
              error: (err) => console.error(err),
            });
          },
          error: (err) => console.error(err),
        });
      });
    });
  }

  handleParent(value: string): void {
    this.category_parent.set(true);
    this.parent_value.set(value);
  }
}
