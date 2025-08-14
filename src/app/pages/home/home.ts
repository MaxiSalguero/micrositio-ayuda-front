import {
  Component,
  inject,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ApiService } from '../../services/api-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

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
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  categories: any;

  private _apiService = inject(ApiService);

  ngOnInit(): void {
    this._apiService
      .getCategories()
      .subscribe((data) => (this.categories = data));
  }

  accordion = viewChild.required(MatAccordion);
}
