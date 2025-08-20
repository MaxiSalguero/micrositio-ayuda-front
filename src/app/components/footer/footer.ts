import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [MatFormFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {}
