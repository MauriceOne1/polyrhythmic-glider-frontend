import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { IdentityService } from '../../core/identity/identity.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Admin {
  readonly identity = inject(IdentityService);
  readonly user = this.identity.currentUser;
  readonly displayName = computed(() => this.resolveDisplayName());
  readonly avatarUrl = computed(() => this.resolveAvatarUrl());
  readonly initials = computed(() => this.resolveInitials());
  readonly createdAt = computed(() => this.formatDate(this.user()?.createdAt));
  readonly lastLoginAt = computed(() => this.formatDate(this.user()?.lastSignInAt));

  private resolveDisplayName(): string {
    const user = this.user();
    const metadata = user?.userMetadata;

    if (!metadata || typeof metadata !== 'object') {
      return user?.email || 'Utente autenticato';
    }

    const fullName = this.readMetadataValue(metadata, ['full_name', 'name', 'display_name']);
    return fullName || user?.email || 'Utente autenticato';
  }

  private resolveAvatarUrl(): string | null {
    const user = this.user();
    const metadata = user?.userMetadata;

    if (!metadata || typeof metadata !== 'object') {
      return null;
    }

    return this.readMetadataValue(metadata, ['avatar_url', 'picture']) || null;
  }

  private resolveInitials(): string {
    const source = this.displayName();
    const parts = source
      .split(/\s+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2);

    if (parts.length === 0) {
      return 'PG';
    }

    return parts.map((part) => part[0]?.toUpperCase() || '').join('');
  }

  private formatDate(value: string | undefined): string {
    if (!value) {
      return 'Non disponibile';
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Non disponibile';
    }

    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsedDate);
  }

  private readMetadataValue(metadata: object, keys: string[]): string {
    for (const key of keys) {
      const value = Reflect.get(metadata, key);

      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
    }

    return '';
  }
}
