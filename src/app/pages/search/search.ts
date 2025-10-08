import { Component, effect, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../services/api-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IPost } from '../../models/post.model';
import { MatIconModule } from '@angular/material/icon';
import { PipeMarkdownPipe } from '../../pipes/pipe-markdown-pipe';

@Component({
  selector: 'app-search',
  imports: [MatListModule, MatIconModule, PipeMarkdownPipe, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  private _route = inject(ActivatedRoute);
  private _apiService = inject(ApiService);

  private queryParams = toSignal(this._route.queryParams);
  results = signal<IPost[]>([]);

  constructor() {
    effect(() => {
      const query = this.queryParams()?.['q'];
      if (query) {
        this._apiService.search(query).subscribe({
          next: (data: IPost[]) => {
            this.results.set(data);
          },
          error: (err: any) => {
            console.error('Error loading articles:', err);
          },
        });
      }
    });
  }
}
