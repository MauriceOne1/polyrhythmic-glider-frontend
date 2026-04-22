import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const COOKIE_NOTICE_STORAGE_KEY = 'polyglider.cookie-notice-dismissed';

@Component({
  selector: 'app-cookie-notice',
  imports: [RouterLink],
  templateUrl: './cookie-notice.html',
  styleUrl: './cookie-notice.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieNotice {
  readonly isVisible = signal(!this.readDismissedState());

  dismiss(): void {
    this.isVisible.set(false);

    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(COOKIE_NOTICE_STORAGE_KEY, 'true');
  }

  private readDismissedState(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(COOKIE_NOTICE_STORAGE_KEY) === 'true';
  }
}
