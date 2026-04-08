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

@Injectable({ providedIn: 'root' })
export class IdentityService {
  readonly currentUser = signal<IdentityUser | null>(null);
  readonly isReady = signal(false);
  readonly authError = signal('');

  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly widgetScriptId = 'netlify-identity-widget';
  private initialized = false;
  private pendingOpen: 'login' | 'signup' | null = null;

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
    this.pendingOpen = 'login';
    this.init();
    window.netlifyIdentity?.open('login');
  }

  openSignup(): void {
    this.pendingOpen = 'signup';
    this.init();
    window.netlifyIdentity?.open('signup');
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
      this.authError.set('Netlify Identity non e disponibile in questa pagina.');
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
      this.flushPendingOpen(identity);
    });

    identity.on('login', async (user) => {
      this.authError.set('');
      this.currentUser.set((user as IdentityUser | null) ?? identity.currentUser());
      identity.close();
      await this.router.navigateByUrl('/');
    });

    identity.on('logout', () => {
      this.currentUser.set(null);
    });

    identity.on('close', async () => {
      if (this.currentUser() || this.router.url !== '/login') {
        return;
      }

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
    this.flushPendingOpen(identity);
  }

  private syncCurrentUser(): void {
    this.currentUser.set(window.netlifyIdentity?.currentUser() ?? null);
  }

  private flushPendingOpen(identity: NetlifyIdentity): void {
    if (!this.pendingOpen) {
      return;
    }

    const tab = this.pendingOpen;
    this.pendingOpen = null;
    identity.open(tab);
  }
}
