import { Component } from '@angular/core';
import { NAV_ITEMS } from '../../../shared/utils/site-content';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
  readonly navItems = NAV_ITEMS;
}
