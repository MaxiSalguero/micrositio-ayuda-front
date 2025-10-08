import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SupportBoxButton } from '../support-box-button/support-box-button';

@Component({
  selector: 'app-support-box',
  imports: [MatCardModule, SupportBoxButton],
  templateUrl: './support-box.html',
  styleUrl: './support-box.scss',
})
export class SupportBox {}
