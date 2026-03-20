import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { HERO_TERMINAL_COMMAND_GROUPS } from '../../shared/utils/site-content';

@Component({
  selector: 'app-hero',
  imports: [FontAwesomeModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, AfterViewInit, OnDestroy {
  private static readonly MAX_TERMINAL_HISTORY = 8;

  @ViewChild('heroCopyCard')
  private heroCopyCard?: ElementRef<HTMLDivElement>;

  @ViewChild('activeCommandViewport')
  private activeCommandViewport?: ElementRef<HTMLSpanElement>;

  readonly terminalHistory = signal<string[]>([]);
  readonly activeCommand = signal('');
  readonly terminalPanelHeight = signal(360);
  readonly isTerminalClosed = signal(false);
  readonly terminalPrompt = 'visitor@polyglider:~$';
  readonly restoreLayoutIcon = faTableColumns;

  private readonly terminalCommandGroups = HERO_TERMINAL_COMMAND_GROUPS;
  private timeoutId: number | null = null;
  private scrollFrameId: number | null = null;
  private copyCardResizeObserver?: ResizeObserver;
  private commandGroupIndex = 0;
  private commandIndex = 0;
  private characterIndex = 0;

  ngAfterViewInit(): void {
    this.syncTerminalPanelHeight();
    this.scheduleViewportScroll();
  }

  ngOnInit(): void {
    this.runTerminal();
  }

  ngOnDestroy(): void {
    this.stopTerminalLoop();

    this.copyCardResizeObserver?.disconnect();
  }

  closeTerminal(): void {
    if (this.isTerminalClosed()) {
      return;
    }

    this.isTerminalClosed.set(true);
    this.activeCommand.set('');
    this.stopTerminalLoop();
  }

  reopenTerminal(): void {
    if (!this.isTerminalClosed()) {
      return;
    }

    this.stopTerminalLoop();
    this.isTerminalClosed.set(false);
    this.terminalHistory.set([]);
    this.activeCommand.set('');
    this.commandGroupIndex = 0;
    this.commandIndex = 0;
    this.characterIndex = 0;

    this.scrollFrameId = window.requestAnimationFrame(() => {
      this.scheduleViewportScroll();
      this.runTerminal();
    });
  }

  private runTerminal(): void {
    if (this.isTerminalClosed()) {
      return;
    }

    if (
      this.commandIndex === 0 &&
      this.characterIndex === 0 &&
      this.terminalHistory().length >= Hero.MAX_TERMINAL_HISTORY
    ) {
      this.terminalHistory.set([]);
      this.commandGroupIndex =
        (this.commandGroupIndex + 1) % this.terminalCommandGroups.length;
    }

    const terminalCommands = this.terminalCommandGroups[this.commandGroupIndex];
    const currentCommand = terminalCommands[this.commandIndex];

    if (this.characterIndex < currentCommand.length) {
      this.characterIndex += 1;
      this.activeCommand.set(currentCommand.slice(0, this.characterIndex));
      this.scheduleViewportScroll();
      this.scheduleNextStep(65);
      return;
    }

    this.terminalHistory.update((history) => {
      const nextHistory = [...history, currentCommand];
      return nextHistory.slice(-Hero.MAX_TERMINAL_HISTORY);
    });
    this.activeCommand.set('');
    this.characterIndex = 0;
    this.commandIndex = (this.commandIndex + 1) % terminalCommands.length;
    this.scheduleViewportScroll();
    this.scheduleNextStep(this.commandIndex === 0 ? 1200 : 900);
  }

  private scheduleNextStep(delay: number): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => this.runTerminal(), delay);
  }

  private scheduleViewportScroll(): void {
    if (this.isTerminalClosed()) {
      return;
    }

    if (this.scrollFrameId !== null) {
      window.cancelAnimationFrame(this.scrollFrameId);
    }

    this.scrollFrameId = window.requestAnimationFrame(() => {
      const activeCommandViewport = this.activeCommandViewport?.nativeElement;

      if (activeCommandViewport) {
        activeCommandViewport.scrollLeft = activeCommandViewport.scrollWidth;
      }
    });
  }

  private stopTerminalLoop(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.scrollFrameId !== null) {
      window.cancelAnimationFrame(this.scrollFrameId);
      this.scrollFrameId = null;
    }
  }

  private syncTerminalPanelHeight(): void {
    const copyCard = this.heroCopyCard?.nativeElement;

    if (!copyCard) {
      return;
    }

    const updateHeight = () => {
      this.terminalPanelHeight.set(
        Math.max(320, Math.ceil(copyCard.getBoundingClientRect().height)),
      );
    };

    updateHeight();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    this.copyCardResizeObserver = new ResizeObserver(() => updateHeight());
    this.copyCardResizeObserver.observe(copyCard);
  }
}
