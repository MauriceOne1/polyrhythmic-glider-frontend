import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  acceptInvite,
  getUser,
  handleAuthCallback,
  login,
  logout,
  onAuthChange,
  requestPasswordRecovery,
  signup,
  updateUser,
  type CallbackResult,
} from '@netlify/identity';
import type { IdentityUser } from '../../shared/models/identity.models';

@Injectable({ providedIn: 'root' })
export class IdentityService {
  readonly currentUser = signal<IdentityUser | null>(null);
  readonly isReady = signal(false);
  readonly isProcessingCallback = signal(false);
  readonly callbackResult = signal<CallbackResult | null>(null);
  readonly authError = signal('');

  private readonly router = inject(Router);
  private initPromise: Promise<void> | null = null;
  private postLoginRedirect = '/';

  init(): void {
    void this.ensureInitialized();
  }

  async resolveCurrentUser(): Promise<IdentityUser | null> {
    await this.ensureInitialized();
    return this.currentUser();
  }

  setPostLoginRedirect(url: string | null | undefined): void {
    this.postLoginRedirect = url || '/';
  }

  async loginWithPassword(email: string, password: string): Promise<void> {
    this.authError.set('');

    try {
      const user = await login(email, password);
      this.currentUser.set(user);
      await this.navigateAfterLogin();
    } catch (error) {
      this.setAuthError(error, 'Accesso non riuscito. Controlla email e password.');
      throw error;
    }
  }

  async signupWithPassword(
    email: string,
    password: string
  ): Promise<IdentityUser> {
    this.authError.set('');

    try {
      const createdUser = await signup(email, password);
      const activeUser = await getUser();

      this.currentUser.set(activeUser);

      if (activeUser) {
        await this.navigateAfterLogin();
      }

      return createdUser;
    } catch (error) {
      this.setAuthError(error, 'Registrazione non riuscita. Riprova tra un attimo.');
      throw error;
    }
  }

  async sendPasswordRecovery(email: string): Promise<void> {
    this.authError.set('');

    try {
      await requestPasswordRecovery(email);
    } catch (error) {
      this.setAuthError(
        error,
        'Non sono riuscito a inviare la mail di recupero password.'
      );
      throw error;
    }
  }

  async updateRecoveredPassword(password: string): Promise<void> {
    this.authError.set('');

    try {
      const user = await updateUser({ password });
      this.currentUser.set(user);
      await this.navigateAfterLogin();
    } catch (error) {
      this.setAuthError(error, 'Non sono riuscito ad aggiornare la password.');
      throw error;
    }
  }

  async acceptInviteWithPassword(password: string): Promise<void> {
    const token = this.callbackResult()?.token;

    if (!token) {
      this.authError.set('Invito non valido o scaduto. Richiedi un nuovo link.');
      throw new Error('Missing invite token');
    }

    this.authError.set('');

    try {
      const user = await acceptInvite(token, password);
      this.currentUser.set(user);
      await this.navigateAfterLogin();
    } catch (error) {
      this.setAuthError(error, 'Non sono riuscito ad attivare questo invito.');
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.authError.set('');

    try {
      await logout();
    } finally {
      this.currentUser.set(null);
      this.callbackResult.set(null);
      await this.router.navigateByUrl('/');
    }
  }

  private ensureInitialized(): Promise<void> {
    if (typeof window === 'undefined') {
      this.isReady.set(true);
      return Promise.resolve();
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    onAuthChange((_event, user) => {
      this.currentUser.set(user);
    });
    this.initPromise = this.bootstrapIdentity();

    return this.initPromise;
  }

  private async bootstrapIdentity(): Promise<void> {
    this.authError.set('');
    this.isProcessingCallback.set(this.hasIdentityHash());

    try {
      if (this.hasIdentityHash()) {
        const callback = await handleAuthCallback();
        this.callbackResult.set(callback);

        if (callback?.user) {
          this.currentUser.set(callback.user);
        }
      }

      const user = await getUser();
      this.currentUser.set(user);
    } catch (error) {
      this.setAuthError(
        error,
        'Non sono riuscito a completare il link di accesso. Potrebbe essere scaduto.'
      );
    } finally {
      this.isProcessingCallback.set(false);
      this.isReady.set(true);
    }
  }

  private async navigateAfterLogin(): Promise<void> {
    const target = this.postLoginRedirect;
    this.postLoginRedirect = '/';
    this.callbackResult.set(null);
    await this.router.navigateByUrl(target);
  }

  private hasIdentityHash(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/.test(
      window.location.hash
    );
  }

  private setAuthError(error: unknown, fallback: string): void {
    const message = error instanceof Error ? error.message : fallback;
    this.authError.set(this.readableAuthMessage(message, fallback));
  }

  private readableAuthMessage(message: string, fallback: string): string {
    const normalized = message.toLowerCase();

    if (normalized.includes('invalid login') || normalized.includes('401')) {
      return 'Email o password non corretti.';
    }

    if (normalized.includes('already registered')) {
      return 'Esiste gia un account con questa email.';
    }

    if (normalized.includes('signup disabled')) {
      return 'Le nuove registrazioni sono disattivate.';
    }

    if (normalized.includes('expired') || normalized.includes('invalid token')) {
      return 'Questo link non e piu valido. Richiedine uno nuovo.';
    }

    return message || fallback;
  }
}
