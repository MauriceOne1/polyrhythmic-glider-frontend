export interface IdentityUserToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  expires_at: number;
}

export interface IdentityUser {
  id: string;
  email: string;
  token?: IdentityUserToken;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export interface NetlifyIdentity {
  init(options?: { locale?: string; APIUrl?: string }): void;
  open(tabName?: 'login' | 'signup'): void;
  close(): void;
  logout(): void | Promise<void>;
  currentUser(): IdentityUser | null;
  on(
    event: 'init' | 'login' | 'logout' | 'error' | 'open' | 'close',
    callback: (payload?: unknown) => void
  ): void;
}
