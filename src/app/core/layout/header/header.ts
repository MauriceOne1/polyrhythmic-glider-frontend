import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}
