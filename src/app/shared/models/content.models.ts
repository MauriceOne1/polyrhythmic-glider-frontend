import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface NavItem {
  label: string;
  fragment?: string;
  href?: string;
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
  icon: IconDefinition;
  external?: boolean;
}

export interface BlogPostBlock {
  heading: string;
  paragraphs: string[];
  snippets?: BlogPostSnippet[];
}

export interface BlogPostSnippet {
  label: string;
  kind: 'code' | 'terminal' | 'latex';
  language: string;
  content: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedLabel: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  tags: string[];
  blocks: BlogPostBlock[];
}
