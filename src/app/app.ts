import { Component } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
