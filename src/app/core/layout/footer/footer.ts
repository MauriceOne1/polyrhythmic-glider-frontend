import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NAV_ITEMS } from '../../../shared/utils/site-content';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
  readonly navItems = NAV_ITEMS;

  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  scrollToTop(event?: Event): void {
    event?.preventDefault();

    this.router.navigateByUrl('/').then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
