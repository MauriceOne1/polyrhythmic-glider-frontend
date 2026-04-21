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
import { ART_NAV_ITEMS, BLOG_NAV_ITEMS, NAV_ITEMS } from '../navigation/nav-items';

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
  readonly userMenuItems = [
    { label: 'Art', href: 'https://art.polyglider.com' },
    { label: 'Shop', href: 'https://shop.polyglider.com' },
    { label: 'Blog', href: 'https://blog.polyglider.com' },
  ];
  readonly isMenuOpen = signal(false);
  readonly isUserMenuOpen = signal(false);
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

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((value) => !value);
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.closeAllMenus();
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (!(target instanceof Element) || target.closest('.user-menu')) {
      return;
    }

    this.closeUserMenu();
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  closeAllMenus(): void {
    this.closeMenu();
    this.closeUserMenu();
  }

  navigateHome(event?: Event): void {
    event?.preventDefault();
    this.closeAllMenus();

    this.router.navigateByUrl(this.homeRoute).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  logout(): Promise<void> {
    this.closeAllMenus();
    return this.identity.logout();
  }

  private resolveNavItems() {
    if (typeof window !== 'undefined' && window.location.hostname === 'art.polyglider.com') {
      return ART_NAV_ITEMS;
    }

    if (typeof window !== 'undefined' && window.location.hostname === 'blog.polyglider.com') {
      return BLOG_NAV_ITEMS;
    }

    return NAV_ITEMS;
  }
}
