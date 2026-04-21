import type { NavItem } from '../../../shared/models/content.models';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', fragment: 'hero' },
  { label: 'Art', href: '/art' },
  { label: 'About', fragment: 'about' },
  { label: 'Contact', fragment: 'contact' },
];

export const ART_NAV_ITEMS: NavItem[] = [
  { label: 'Mostra', href: '/' },
  { label: 'Main site', externalHref: 'https://polyglider.com/' },
  { label: 'Contact', externalHref: 'https://polyglider.com/#contact' },
];
