import { Injectable, inject, isDevMode, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  acceptInvite,
  getUser,
  handleAuthCallback,
  login,
  logout,
  onAuthChange,
  recoverPassword,
  requestPasswordRecovery,
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
  readonly isLocalDevAuthEnabled = this.canUseLocalDevAuth();

  private readonly router = inject(Router);
  private initPromise: Promise<void> | null = null;
  private postLoginRedirect = '/';
  private recoveryToken: string | null = null;
  private readonly devSessionStorageKey = 'polyglider.dev-auth-session';

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
    this.ensureSecureIdentityOrigin();

    try {
      const user = await login(email, password);
      this.currentUser.set(user);
      await this.navigateAfterLogin();
    } catch (error) {
      this.setAuthError(error, 'Accesso non riuscito. Controlla email e password.');
      throw error;
    }
  }

  async sendPasswordRecovery(email: string): Promise<void> {
    this.authError.set('');
    this.ensureSecureIdentityOrigin();

    try {
      await requestPasswordRecovery(email);
    } catch (error) {
      this.setAuthError(error, 'Non sono riuscito a inviare la mail di recupero password.');
      throw error;
    }
  }

  async updateRecoveredPassword(password: string): Promise<void> {
    this.ensureSecureIdentityOrigin();
    const token = this.recoveryToken;

    if (!token) {
      this.authError.set('Link di recupero non valido o scaduto. Richiedine uno nuovo.');
      throw new Error('Missing recovery token');
    }

    this.authError.set('');

    try {
      const user = await recoverPassword(token, password);
      this.currentUser.set(user);
      await this.navigateAfterLogin();
    } catch (error) {
      this.setAuthError(error, 'Non sono riuscito ad aggiornare la password.');
      throw error;
    }
  }

  async acceptInviteWithPassword(password: string): Promise<void> {
    this.ensureSecureIdentityOrigin();
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

    if (this.isUsingLocalDevSession()) {
      this.clearLocalDevSession();
      this.currentUser.set(null);
      this.callbackResult.set(null);
      await this.router.navigateByUrl('/');
      return;
    }

    this.ensureSecureIdentityOrigin();

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

    if (this.restoreLocalDevSession()) {
      this.isReady.set(true);
      return Promise.resolve();
    }

    if (!this.hasSecureIdentityOrigin()) {
      this.finishInsecureIdentityInit();
      return Promise.resolve();
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
      const recoveryToken = this.readHashParam('recovery_token');

      if (recoveryToken) {
        this.recoveryToken = recoveryToken;
        this.callbackResult.set({ type: 'recovery', user: null });
        this.clearHash();
      } else if (this.hasIdentityHash()) {
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
        'Non sono riuscito a completare il link di accesso. Potrebbe essere scaduto.',
      );
    } finally {
      this.isProcessingCallback.set(false);
      this.isReady.set(true);
    }
  }

  private finishInsecureIdentityInit(): void {
    this.currentUser.set(null);
    this.callbackResult.set(null);
    this.isProcessingCallback.set(false);
    this.isReady.set(true);

    if (this.hasIdentityHash() && !this.isLocalDevAuthEnabled) {
      this.authError.set(this.secureIdentityMessage());
      this.clearHash();
    }
  }

  async loginWithLocalDevAccount(): Promise<void> {
    if (!this.isLocalDevAuthEnabled) {
      const message = 'Accesso fake disponibile solo in locale durante lo sviluppo.';
      this.authError.set(message);
      throw new Error(message);
    }

    const user = this.createLocalDevUser();
    this.authError.set('');
    this.persistLocalDevSession(user);
    this.currentUser.set(user);
    await this.navigateAfterLogin();
  }

  private ensureSecureIdentityOrigin(): void {
    if (this.hasSecureIdentityOrigin()) {
      return;
    }

    const message = this.secureIdentityMessage();
    this.authError.set(message);
    throw new Error(message);
  }

  private hasSecureIdentityOrigin(): boolean {
    return typeof window !== 'undefined' && window.location.protocol === 'https:';
  }

  private secureIdentityMessage(): string {
    return 'Accesso non disponibile: Netlify Identity richiede HTTPS.';
  }

  private async navigateAfterLogin(): Promise<void> {
    const target = this.postLoginRedirect;
    this.postLoginRedirect = '/';
    this.recoveryToken = null;
    this.callbackResult.set(null);
    await this.router.navigateByUrl(target);
  }

  private hasIdentityHash(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return /^#(confirmation_token|recovery_token|invite_token|email_change_token|access_token)=/.test(
      window.location.hash,
    );
  }

  private readHashParam(name: string): string | null {
    if (typeof window === 'undefined' || !window.location.hash) {
      return null;
    }

    const params = new URLSearchParams(window.location.hash.slice(1));
    return params.get(name);
  }

  private clearHash(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.history.replaceState(
      window.history.state,
      this.documentTitle(),
      `${window.location.pathname}${window.location.search}`,
    );
  }

  private documentTitle(): string {
    return typeof document === 'undefined' ? '' : document.title;
  }

  private canUseLocalDevAuth(): boolean {
    if (!isDevMode() || typeof window === 'undefined') {
      return false;
    }

    return ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  }

  private createLocalDevUser(): IdentityUser {
    const now = new Date().toISOString();

    return {
      id: 'dev-local-user',
      email: 'dev@localhost.polyglider',
      createdAt: now,
      lastSignInAt: now,
      name: 'Local Dev Admin',
      pictureUrl: '',
      userMetadata: {
        full_name: 'Local Dev Admin',
      },
      appMetadata: {
        provider: 'email',
        roles: ['admin'],
      },
      role: 'admin',
      roles: ['admin'],
      provider: 'email',
    };
  }

  private persistLocalDevSession(user: IdentityUser): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(this.devSessionStorageKey, JSON.stringify(user));
  }

  private restoreLocalDevSession(): boolean {
    if (!this.isLocalDevAuthEnabled || typeof window === 'undefined') {
      return false;
    }

    const rawSession = window.sessionStorage.getItem(this.devSessionStorageKey);

    if (!rawSession) {
      return false;
    }

    try {
      const parsedSession = JSON.parse(rawSession) as IdentityUser;
      this.currentUser.set(parsedSession);
      this.callbackResult.set(null);
      this.isProcessingCallback.set(false);
      return true;
    } catch {
      this.clearLocalDevSession();
      return false;
    }
  }

  private isUsingLocalDevSession(): boolean {
    if (!this.isLocalDevAuthEnabled || typeof window === 'undefined') {
      return false;
    }

    return window.sessionStorage.getItem(this.devSessionStorageKey) !== null;
  }

  private clearLocalDevSession(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.removeItem(this.devSessionStorageKey);
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

    if (normalized.includes('expired') || normalized.includes('invalid token')) {
      return 'Questo link non e piu valido. Richiedine uno nuovo.';
    }

    return message || fallback;
  }
}
