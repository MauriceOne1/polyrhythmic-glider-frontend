import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

interface LinkEntry {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly note: string;
}

interface StoredLinkClicks {
  readonly [key: string]: number;
}

declare global {
  interface Window {
    sa_event?: (eventName: string, payload?: Record<string, string | number | boolean>) => void;
  }
}

const LINK_CLICKS_STORAGE_KEY = 'polyglider-links-clicks';

@Component({
  selector: 'app-links',
  templateUrl: './links.html',
  styleUrl: './links.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Links {
  private readonly document = inject(DOCUMENT);

  readonly title = 'Polyglider';
  readonly bio =
    'Musica, codice ed esperimenti digitali. Qui sotto trovi i link principali, tutti in un posto solo.';
  readonly links: readonly LinkEntry[] = [
    {
      id: 'site',
      label: 'Sito',
      href: 'https://polyglider.com/',
      note: 'Per entrare nel sito principale e vedere tutto il progetto',
    },
    {
      id: 'byos',
      label: 'Evento BYOS',
      href: '/partecipa',
      note: 'Se vuoi iscriverti alla jam, qui trovi tutte le info',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: 'https://instagram.com/polyglider',
      note: 'Per seguire aggiornamenti, immagini e cose in movimento',
    },
  ];

  trackLinkClick(link: LinkEntry): void {
    this.storeLocalClick(link.id);
    this.trackAnalyticsEvent(link);
  }

  private storeLocalClick(linkId: string): void {
    const win = this.document.defaultView;

    if (!win) {
      return;
    }

    const storedClicks = this.readStoredClicks(win);
    const nextClicks: StoredLinkClicks = {
      ...storedClicks,
      [linkId]: (storedClicks[linkId] ?? 0) + 1,
    };

    win.localStorage.setItem(LINK_CLICKS_STORAGE_KEY, JSON.stringify(nextClicks));
  }

  private readStoredClicks(win: Window): StoredLinkClicks {
    const rawValue = win.localStorage.getItem(LINK_CLICKS_STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    try {
      const parsed = JSON.parse(rawValue);
      return this.isStoredLinkClicks(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  private isStoredLinkClicks(value: unknown): value is StoredLinkClicks {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    return Object.values(value).every((entry) => typeof entry === 'number');
  }

  private trackAnalyticsEvent(link: LinkEntry): void {
    const win = this.document.defaultView;

    if (!win?.sa_event) {
      return;
    }

    win.sa_event('links_click', {
      link_id: link.id,
      link_label: link.label,
      link_href: link.href,
    });
  }
}
