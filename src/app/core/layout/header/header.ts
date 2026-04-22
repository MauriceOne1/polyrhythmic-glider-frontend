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
import { ART_NAV_ITEMS, BLOG_NAV_ITEMS, NAV_ITEMS, SHOP_NAV_ITEMS } from '../navigation/nav-items';
import { getEffectiveHostname, getSubdomainSiteUrl } from '../../../shared/utils/host.utils';

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
    { label: 'Art', href: getSubdomainSiteUrl('art.polyglider.com') },
    { label: 'Shop', href: getSubdomainSiteUrl('shop.polyglider.com') },
    { label: 'Blog', href: getSubdomainSiteUrl('blog.polyglider.com') },
  ];
  readonly isMenuOpen = signal(false);
  readonly isUserMenuOpen = signal(false);
  readonly identity = inject(IdentityService);
  readonly user = this.identity.currentUser;
  readonly isLoggedIn = computed(() => this.user() !== null);
  readonly displayName = computed(() => this.resolveDisplayName());
  readonly avatarUrl = computed(() => this.resolveAvatarUrl());
  readonly initials = computed(() => this.resolveInitials());

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

  private resolveDisplayName(): string {
    const user = this.user();
    const metadata = user?.userMetadata;

    if (!metadata || typeof metadata !== 'object') {
      return user?.name || user?.email || 'Utente autenticato';
    }

    const fullName = this.readMetadataValue(metadata, ['full_name', 'name', 'display_name']);
    return fullName || user?.name || user?.email || 'Utente autenticato';
  }

  private resolveAvatarUrl(): string | null {
    const user = this.user();
    const metadata = user?.userMetadata;

    if (!metadata || typeof metadata !== 'object') {
      return user?.pictureUrl || null;
    }

    return this.readMetadataValue(metadata, ['avatar_url', 'picture']) || user?.pictureUrl || null;
  }

  private resolveInitials(): string {
    const source = this.displayName();
    const parts = source
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2);

    if (parts.length === 0) {
      return 'PG';
    }

    return parts.map((part) => part[0]?.toUpperCase() || '').join('');
  }

  private readMetadataValue(metadata: object, keys: string[]): string {
    for (const key of keys) {
      const value = Reflect.get(metadata, key);

      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }

    return '';
  }

  private resolveNavItems() {
    const hostname = getEffectiveHostname();

    if (hostname === 'art.polyglider.com') {
      return ART_NAV_ITEMS;
    }

    if (hostname === 'blog.polyglider.com') {
      return BLOG_NAV_ITEMS;
    }

    if (hostname === 'shop.polyglider.com') {
      return SHOP_NAV_ITEMS;
    }

    return NAV_ITEMS;
  }
}
