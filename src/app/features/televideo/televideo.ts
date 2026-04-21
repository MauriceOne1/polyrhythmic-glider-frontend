import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { Attributes, Colour, Level, Teletext } from '@techandsoftware/teletext';

interface TeletextPage {
  readonly lines: readonly string[];
  readonly title: string;
}

@Component({
  selector: 'app-televideo',
  templateUrl: './televideo.html',
  styleUrl: './televideo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Televideo implements AfterViewInit, OnDestroy {
  @ViewChild('screenHost', { static: true })
  private readonly screenHost?: ElementRef<HTMLDivElement>;

  readonly currentPage = signal('100');
  readonly osdText = signal('');
  readonly visiblePage = computed(() => this.pages[this.currentPage()] ?? this.pages['100']);

  private teletext: ReturnType<typeof Teletext> | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private digitBuffer = '';
  private hideOsdId: number | null = null;
  readonly hostId = 'televideo-screen';
  private readonly handleKeydown = (event: KeyboardEvent) => this.onKeydown(event);
  private readonly pageSequence = ['100', '101', '102', '103'] as const;
  private readonly pages: Record<string, TeletextPage> = {
    '100': {
      title: 'HOME',
      lines: [
        this.band(' LINK ACADEMY TELETEXT ', Colour.RED, Colour.WHITE),
        this.band(' 101  ABOUT ', Colour.YELLOW, Colour.BLACK),
        this.band(' 102  FEATURES ', Colour.CYAN, Colour.BLACK),
        this.band(' 103  CONTROLS ', Colour.GREEN, Colour.BLACK),
        '',
        this.colourLine('Televideo demo minimale in Angular', Colour.YELLOW),
        'usando @techandsoftware/teletext.',
        '',
        this.colourLine('Questo esempio mostra:', Colour.CYAN),
        '- pagine 40x24 reali',
        '- navigazione numerica',
        '- cambio pagina con frecce',
        '- footer e testata stile teletext',
        '',
        'Premi 1 0 1 oppure usa i pulsanti sotto.',
        '',
        '',
        '',
        '',
        '',
        '',
        this.footer([
          ['100', 'HOME'],
          ['101', 'ABOUT'],
          ['102', 'FEATURES'],
          ['103', 'CONTROLS'],
        ]),
      ],
    },
    '101': {
      title: 'ABOUT',
      lines: [
        this.band(' ABOUT THIS PAGE ', Colour.YELLOW, Colour.BLACK),
        '',
        this.colourLine('Obiettivo', Colour.CYAN),
        'Portare il linguaggio del televideo',
        'dentro una route Angular vera, senza',
        'riempire le pagine di contenuti inutili.',
        '',
        this.colourLine('Approccio', Colour.CYAN),
        'Una sola schermata SVG viene renderizzata',
        'dalla libreria e aggiornata cambiando',
        'il contenuto della pagina corrente.',
        '',
        'La route ora e: /televideo',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        this.footer([
          ['100', 'HOME'],
          ['102', 'FEATURES'],
          ['103', 'CONTROLS'],
        ]),
      ],
    },
    '102': {
      title: 'FEATURES',
      lines: [
        this.band(' FEATURES ', Colour.CYAN, Colour.BLACK),
        '',
        this.colourLine('Motore', Colour.YELLOW),
        '@techandsoftware/teletext',
        '',
        this.colourLine('Funzioni demo', Colour.YELLOW),
        'Page rows 40x24',
        'Char attributes per colore',
        'Cambio pagina da tastiera',
        'OSD piccolo sovrapposto',
        'Quick links esterni cliccabili',
        '',
        this.colourLine('Scopo', Colour.GREEN),
        'Usare la libreria come base per futuri',
        'esperimenti teletext piu complessi.',
        '',
        '',
        '',
        '',
        '',
        '',
        this.footer([
          ['100', 'HOME'],
          ['101', 'ABOUT'],
          ['103', 'CONTROLS'],
        ]),
      ],
    },
    '103': {
      title: 'CONTROLS',
      lines: [
        this.band(' CONTROLS ', Colour.GREEN, Colour.BLACK),
        '',
        this.colourLine('Numeri', Colour.YELLOW),
        'Digita tre cifre: 100, 101, 102, 103',
        '',
        this.colourLine('Navigazione', Colour.YELLOW),
        'ArrowRight / PageUp  -> next',
        'ArrowLeft  / PageDown -> prev',
        'Home -> torna a 100',
        'Esc  -> cancella buffer o torna home',
        '',
        this.colourLine('Nota', Colour.CYAN),
        'L OSD in basso a destra mostra i tasti',
        'premuti come in un piccolo telecomando.',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        this.footer([
          ['100', 'HOME'],
          ['101', 'ABOUT'],
          ['102', 'FEATURES'],
        ]),
      ],
    },
  };

  ngAfterViewInit(): void {
    if (!this.screenHost?.nativeElement) {
      return;
    }

    this.teletext = Teletext();
    this.teletext.addTo(`#${this.hostId}`);
    this.teletext.setLevel(Level[1]);
    this.teletext.setDefaultG0Charset('g0_latin__italian');
    this.syncScreenSize();
    this.renderCurrentPage();
    this.resizeObserver = new ResizeObserver(() => this.syncScreenSize());
    this.resizeObserver.observe(this.screenHost.nativeElement);

    document.addEventListener('keydown', this.handleKeydown);
  }

  ngOnDestroy(): void {
    if (this.hideOsdId !== null) {
      window.clearTimeout(this.hideOsdId);
    }

    document.removeEventListener('keydown', this.handleKeydown);
    this.resizeObserver?.disconnect();
    this.teletext?.remove();
    this.teletext?.destroy();
  }

  gotoPage(page: string): void {
    if (!this.pages[page]) {
      return;
    }

    this.currentPage.set(page);
    this.renderCurrentPage();
    this.showOsd(`PAGE ${page}`);
  }

  private renderCurrentPage(): void {
    if (!this.teletext) {
      return;
    }

    this.teletext.setPageRows(this.normalizeLines(this.visiblePage().lines));
  }

  private syncScreenSize(): void {
    if (!this.teletext || !this.screenHost?.nativeElement) {
      return;
    }

    const { clientHeight, clientWidth } = this.screenHost.nativeElement;

    if (clientHeight <= 0 || clientWidth <= 0) {
      return;
    }

    this.teletext.setAspectRatio(clientWidth / clientHeight);
    this.teletext.setHeight(clientHeight);
  }

  private onKeydown(event: KeyboardEvent): void {
    if (this.isTypingContext(document.activeElement)) {
      return;
    }

    const digit = this.getDigit(event);

    if (digit !== null) {
      event.preventDefault();
      this.pushDigit(digit);
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'PageUp') {
      event.preventDefault();
      this.stepPage(1, 'NEXT');
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'PageDown') {
      event.preventDefault();
      this.stepPage(-1, 'PREV');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.clearDigitBuffer();
      this.gotoPage('100');
      return;
    }

    if (event.key === 'Escape' || event.key === 'Backspace') {
      event.preventDefault();

      if (this.digitBuffer.length > 0) {
        this.clearDigitBuffer();
        this.showOsd('CLR');
        return;
      }

      this.gotoPage('100');
    }
  }

  private pushDigit(digit: string): void {
    this.digitBuffer = (this.digitBuffer + digit).slice(0, 3);
    this.showOsd(`PAGE ${this.digitBuffer}`);

    if (this.digitBuffer.length === 3) {
      const page = this.digitBuffer;
      this.clearDigitBuffer();
      this.gotoPage(page);
    }
  }

  private clearDigitBuffer(): void {
    this.digitBuffer = '';
  }

  private stepPage(delta: number, osdLabel: string): void {
    const pages = [...this.pageSequence];
    const currentIndex = pages.indexOf(this.currentPage() as (typeof this.pageSequence)[number]);

    if (currentIndex === -1) {
      return;
    }

    const nextIndex = currentIndex + delta;

    if (nextIndex < 0 || nextIndex >= pages.length) {
      return;
    }

    this.clearDigitBuffer();
    this.showOsd(osdLabel);
    this.gotoPage(pages[nextIndex]);
  }

  private showOsd(text: string): void {
    this.osdText.set(text);

    if (this.hideOsdId !== null) {
      window.clearTimeout(this.hideOsdId);
    }

    this.hideOsdId = window.setTimeout(() => this.osdText.set(''), 1400);
  }

  private normalizeLines(lines: readonly string[]): string[] {
    const output = [...lines];

    while (output.length < 24) {
      output.push('');
    }

    return output.slice(0, 24);
  }

  private band(text: string, foreground: symbol, background: symbol): string {
    return (
      Attributes.charFromTextColour(background) +
      Attributes.charFromAttribute(Attributes.NEW_BACKGROUND) +
      Attributes.charFromTextColour(foreground) +
      this.padRight(text, 37)
    );
  }

  private colourLine(text: string, foreground: symbol): string {
    return Attributes.charFromTextColour(foreground) + text;
  }

  private footer(items: ReadonlyArray<readonly [string, string]>): string {
    const content = items.map(([page, label]) => `${page} ${label}`).join('  ');
    return Attributes.charFromTextColour(Colour.WHITE) + this.padRight(`LINK ${content}`, 40);
  }

  private padRight(text: string, length: number): string {
    return text.length >= length ? text.slice(0, length) : text + ' '.repeat(length - text.length);
  }

  private getDigit(event: KeyboardEvent): string | null {
    if (/^\d$/.test(event.key)) {
      return event.key;
    }

    if (typeof event.code === 'string') {
      const match = event.code.match(/^(?:Digit|Numpad)(\d)$/);
      return match ? match[1] : null;
    }

    return null;
  }

  private isTypingContext(element: Element | null): boolean {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    const tag = element.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || element.isContentEditable;
  }
}
