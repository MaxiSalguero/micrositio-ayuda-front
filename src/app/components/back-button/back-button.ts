import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.scss',
})
export class BackButton {}
