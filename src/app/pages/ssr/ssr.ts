import { CommonModule, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-ssr',
  imports: [CommonModule],
  templateUrl: './ssr.html',
  styleUrl: './ssr.scss',
})
export class Ssr implements OnInit {
  items: any[] = [];
  images: string[] = [];
  isBrowser = false;

  // constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  private _platformId: Object = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this._platformId);

    for (let i = 0; i < 30; i++) {
      this.images.push(`https://picsum.photos/seed/${i}/300/200`);
    }

    for (let i = 0; i < 2000; i++) {
      this.items.push({
        id: i,
        name: `Elemento ${i + 1}`,
        description: `Descripción larga del elemento número ${i + 1}.`,
      });
    }
  }
}
