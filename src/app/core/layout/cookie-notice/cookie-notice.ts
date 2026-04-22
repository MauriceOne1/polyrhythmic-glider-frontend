import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const COOKIE_NOTICE_STORAGE_KEY = 'polyglider.cookie-notice-dismissed';
const COOKIE_NOTICE_AUTO_DISMISS_MS = 9000;

@Component({
  selector: 'app-cookie-notice',
  imports: [RouterLink],
  templateUrl: './cookie-notice.html',
  styleUrl: './cookie-notice.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieNotice implements OnInit, OnDestroy {
  readonly autoDismissMs = COOKIE_NOTICE_AUTO_DISMISS_MS;
  readonly isVisible = signal(!this.readDismissedState());
  private dismissTimerId: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.startAutoDismiss();
  }

  dismiss(): void {
    this.clearAutoDismiss();
    this.isVisible.set(false);

    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, 'true');
  }

  ngOnDestroy(): void {
    this.clearAutoDismiss();
  }

  private startAutoDismiss(): void {
    if (!this.isVisible() || typeof window === 'undefined') {
      return;
    }

    this.dismissTimerId = window.setTimeout(() => {
      this.dismiss();
    }, this.autoDismissMs);
  }

  private clearAutoDismiss(): void {
    if (this.dismissTimerId === null) {
      return;
    }

    clearTimeout(this.dismissTimerId);
    this.dismissTimerId = null;
  }

  private readDismissedState(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) === 'true';
  }
}
