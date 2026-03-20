import type { HeroIconName } from './icon.models';

export interface NavItem {
  label: string;
  fragment: string;
}

export interface FeatureCard {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
  description: string;
  icon: HeroIconName;
  external?: boolean;
}
