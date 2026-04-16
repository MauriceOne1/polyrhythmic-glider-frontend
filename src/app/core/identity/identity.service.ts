import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import type {
  IdentityUser,
  NetlifyIdentity,
} from '../../shared/models/identity.models';
import { SITE_URL } from '../../shared/utils/seo.config';

declare global {
  interface Window {
    netlifyIdentity?: NetlifyIdentity;
  }
}

type IdentityOpenMode = 'login' | 'signup' | 'default';

@Injectable({ providedIn: 'root' })
export class IdentityService {
  readonly currentUser = signal<IdentityUser | null>(null);
  readonly isReady = signal(false);
  readonly authError = signal('');

  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly widgetScriptId = 'netlify-identity-widget';
  private initialized = false;
  private pendingOpen: IdentityOpenMode | null = null;
  private postLoginRedirect = '/';
  private suppressNextCloseNavigation = false;
  private handlingIdentityAction = false;

  init(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.initialized) {
      this.syncCurrentUser();
      return;
    }

    this.initialized = true;

    if (window.netlifyIdentity) {
      this.bindIdentity(window.netlifyIdentity);
      return;
    }

    this.ensureWidgetScript();
  }

  openLogin(): void {
    this.openWidget('login');
  }

  openSignup(): void {
    this.openWidget('signup');
  }

  openIdentityAction(): void {
    this.handlingIdentityAction = true;
    this.openWidget('default');
  }

  closeWidget(): void {
    this.pendingOpen = null;
    this.handlingIdentityAction = false;

    if (typeof window === 'undefined' || !window.netlifyIdentity) {
      return;
    }

    this.suppressNextCloseNavigation = true;
    window.netlifyIdentity.close();
    window.setTimeout(() => {
      this.suppressNextCloseNavigation = false;
    }, 500);
  }

  async resolveCurrentUser(): Promise<IdentityUser | null> {
    this.init();
    this.syncCurrentUser();

    if (this.currentUser()) {
      return this.currentUser();
    }

    if (this.isReady()) {
      return null;
    }

    return new Promise((resolve) => {
      const startedAt = Date.now();
      const intervalId = window.setInterval(() => {
        this.syncCurrentUser();

        if (this.currentUser() || this.isReady() || Date.now() - startedAt > 5000) {
          window.clearInterval(intervalId);
          resolve(this.currentUser());
        }
      }, 50);
    });
  }

  setPostLoginRedirect(url: string | null | undefined): void {
    this.postLoginRedirect = url || '/';
  }

  async logout(): Promise<void> {
    this.authError.set('');

    try {
      await window.netlifyIdentity?.logout();
    } finally {
      this.currentUser.set(null);
      await this.router.navigateByUrl('/');
    }
  }

  private openWidget(mode: IdentityOpenMode): void {
    this.pendingOpen = mode;
    this.init();

    if (
      typeof window !== 'undefined' &&
      window.netlifyIdentity &&
      this.isReady()
    ) {
      this.flushPendingOpen(window.netlifyIdentity);
    }
  }

  private ensureWidgetScript(): void {
    const existingScript = this.document.getElementById(this.widgetScriptId);

    if (existingScript) {
      existingScript.addEventListener('load', () => this.initializeWidget(), {
        once: true,
      });
      return;
    }

    const script = this.document.createElement('script');
    script.id = this.widgetScriptId;
    script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
    script.async = true;
    script.addEventListener('load', () => this.initializeWidget(), {
      once: true,
    });
    script.addEventListener('error', () => {
      this.authError.set(
        'Impossibile caricare Netlify Identity. Verifica deploy Netlify e HTTPS.'
      );
      this.isReady.set(true);
    });

    this.document.body.appendChild(script);
  }

  private initializeWidget(): void {
    if (!window.netlifyIdentity) {
      this.authError.set('Netlify Identity non è disponibile in questa pagina.');
      this.isReady.set(true);
      return;
    }

    this.bindIdentity(window.netlifyIdentity);
  }

  private bindIdentity(identity: NetlifyIdentity): void {
    identity.init({
      locale: 'en',
      APIUrl: `${SITE_URL}/.netlify/identity`,
    });

    identity.on('init', (user) => {
      this.currentUser.set((user as IdentityUser | null) ?? identity.currentUser());
      this.isReady.set(true);
      this.closeWidgetIfAuthenticated(identity);
      this.flushPendingOpen(identity);
    });

    identity.on('login', async (user) => {
      this.authError.set('');
      this.currentUser.set((user as IdentityUser | null) ?? identity.currentUser());

      if (this.isHandlingIdentityAction()) {
        return;
      }

      identity.close();
      await this.router.navigateByUrl(this.postLoginRedirect);
      this.postLoginRedirect = '/';
    });

    identity.on('logout', () => {
      this.currentUser.set(null);
    });

    identity.on('close', async () => {
      if (this.suppressNextCloseNavigation) {
        this.suppressNextCloseNavigation = false;
        return;
      }

      if (this.currentUser() && this.router.url.startsWith('/login')) {
        if (!this.handlingIdentityAction) {
          return;
        }

        this.handlingIdentityAction = false;
        await this.router.navigateByUrl(this.postLoginRedirect);
        this.postLoginRedirect = '/';
        return;
      }

      if (this.currentUser() || !this.router.url.startsWith('/login')) {
        return;
      }

      this.handlingIdentityAction = false;
      await this.router.navigateByUrl('/');
    });

    identity.on('error', (error) => {
      this.authError.set(
        error instanceof Error
          ? error.message
          : 'Autenticazione non riuscita. Riprova tra un attimo.'
      );
    });

    this.syncCurrentUser();
    this.isReady.set(true);
    this.closeWidgetIfAuthenticated(identity);
    this.flushPendingOpen(identity);
  }

  private syncCurrentUser(): void {
    this.currentUser.set(window.netlifyIdentity?.currentUser() ?? null);
  }

  private flushPendingOpen(identity: NetlifyIdentity): void {
    if (!this.pendingOpen) {
      return;
    }

    const mode = this.pendingOpen;
    this.pendingOpen = null;

    if (mode === 'default') {
      identity.open();
      return;
    }

    identity.open(mode);
  }

  private closeWidgetIfAuthenticated(identity: NetlifyIdentity): void {
    if (!this.currentUser() || this.isHandlingIdentityAction()) {
      return;
    }

    identity.close();
  }

  private isHandlingIdentityAction(): boolean {
    return this.handlingIdentityAction || this.hasIdentityActionHash();
  }

  private hasIdentityActionHash(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const { hash } = window.location;

    return (
      hash.includes('confirmation_token=') ||
      hash.includes('recovery_token=') ||
      hash.includes('invite_token=') ||
      hash.includes('email_change_token=')
    );
  }
}
