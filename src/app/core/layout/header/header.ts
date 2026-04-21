import { ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { IdentityService } from '../../identity/identity.service';
import { ART_NAV_ITEMS, NAV_ITEMS } from '../navigation/nav-items';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly homeRoute = '/';
  readonly navItems = this.resolveNavItems();
  readonly isMenuOpen = signal(false);
  readonly identity = inject(IdentityService);
  readonly user = this.identity.currentUser;
  readonly isLoggedIn = computed(() => this.user() !== null);

  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  constructor() {
    this.identity.init();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeMenu());
  }

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.closeMenu();
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  navigateHome(event?: Event): void {
    event?.preventDefault();
    this.closeMenu();

    this.router.navigateByUrl(this.homeRoute).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  logout(): Promise<void> {
    this.closeMenu();
    return this.identity.logout();
  }

  private resolveNavItems() {
    if (typeof window !== 'undefined' && window.location.hostname === 'art.polyglider.com') {
      return ART_NAV_ITEMS;
    }

    return NAV_ITEMS;
  }
}
