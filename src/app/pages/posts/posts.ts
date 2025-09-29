import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api-service';
import { IPost } from '../../models/post.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { IRelated, Post } from '../../models/related.model';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-posts',
  imports: [
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatChipsModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MarkdownComponent,
  ],
  templateUrl: './posts.html',
  styleUrl: './posts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Posts implements OnInit {
  post?: IPost;
  related: Post[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _apiService: ApiService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe({
      next: (params: Params) => {
        const currentPostId = Number(params['postId']);

        this._apiService.getPostById(currentPostId).subscribe({
          next: (data: IPost) => (this.post = data),
          error: (err) => console.log(err),
        });

        this._apiService.getRelated().subscribe({
          next: (data: IRelated[]) => {
            this.related = data
              .filter((item) => item.post.id === currentPostId)
              .map((item) => item.related);
          },
          error: (err) => console.log(err),
        });
      },
    });
  }
}
