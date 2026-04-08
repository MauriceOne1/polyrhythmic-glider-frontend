import { ViewportScroller } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IdentityService } from '../../identity/identity.service';
import { NAV_ITEMS } from '../../../shared/utils/site-content';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly navItems = NAV_ITEMS;
  readonly isMenuOpen = signal(false);
  readonly identity = inject(IdentityService);
  readonly user = this.identity.currentUser;
  readonly isLoggedIn = computed(() => this.user() !== null);

  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  constructor() {
    this.identity.init();
  }

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  navigateHome(event?: Event): void {
    event?.preventDefault();
    this.closeMenu();

    this.router.navigateByUrl('/').then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  logout(): Promise<void> {
    this.closeMenu();
    return this.identity.logout();
  }
}
