import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import type { SeoData } from '../../shared/models/seo.models';
import { DEFAULT_SEO, SITE_LOCALE, SITE_NAME, SITE_URL } from '../../shared/utils/seo.config';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  updatePage(seo: SeoData | undefined, routePath: string): void {
    const resolvedSeo = {
      ...DEFAULT_SEO,
      ...seo,
      keywords: seo?.keywords ?? DEFAULT_SEO.keywords,
    };
    const canonicalUrl = this.buildCanonicalUrl(routePath);
    const pageTitle = resolvedSeo.title || SITE_NAME;

    this.title.setTitle(pageTitle);
    this.setHtmlLang('it');
    this.updateCanonicalLink(canonicalUrl);

    this.updateNameTag('description', resolvedSeo.description);
    this.updateNameTag('keywords', resolvedSeo.keywords?.join(', '));
    this.updateNameTag('robots', resolvedSeo.robots ?? 'index,follow');
    this.updateNameTag('author', SITE_NAME);
    this.updateNameTag('application-name', SITE_NAME);

    this.updatePropertyTag('og:title', pageTitle);
    this.updatePropertyTag('og:description', resolvedSeo.description);
    this.updatePropertyTag('og:type', resolvedSeo.type ?? 'website');
    this.updatePropertyTag('og:url', canonicalUrl);
    this.updatePropertyTag('og:site_name', SITE_NAME);
    this.updatePropertyTag('og:locale', SITE_LOCALE);

    this.updateNameTag('twitter:card', 'summary');
    this.updateNameTag('twitter:title', pageTitle);
    this.updateNameTag('twitter:description', resolvedSeo.description);
  }

  private buildCanonicalUrl(routePath: string): string {
    if (!routePath || routePath === '/') {
      return `${SITE_URL}/`;
    }

    return `${SITE_URL}${routePath}`;
  }

  private setHtmlLang(lang: string): void {
    this.document.documentElement.lang = lang;
  }

  private updateCanonicalLink(url: string): void {
    let canonicalLink = this.document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;

    if (!canonicalLink) {
      canonicalLink = this.document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute('href', url);
  }

  private updateNameTag(name: string, content: string | undefined): void {
    if (!content) {
      return;
    }

    this.meta.updateTag({ name, content });
  }

  private updatePropertyTag(property: string, content: string | undefined): void {
    if (!content) {
      return;
    }

    this.meta.updateTag({ property, content });
  }
}
