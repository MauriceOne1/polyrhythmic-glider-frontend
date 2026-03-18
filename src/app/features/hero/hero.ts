import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';
import { HERO_TERMINAL_COMMANDS } from '../../shared/utils/site-content';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  @ViewChild('terminalViewport')
  private terminalViewport?: ElementRef<HTMLDivElement>;

  readonly terminalHistory = signal<string[]>([]);
  readonly activeCommand = signal('');
  readonly terminalPrompt = 'visitor@polyglider:~$';

  private readonly terminalCommands = HERO_TERMINAL_COMMANDS;
  private timeoutId: number | null = null;
  private scrollFrameId: number | null = null;
  private commandIndex = 0;
  private characterIndex = 0;

  ngOnInit(): void {
    this.runTerminal();
  }

  ngOnDestroy(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
    }

    if (this.scrollFrameId !== null) {
      window.cancelAnimationFrame(this.scrollFrameId);
    }
  }

  private runTerminal(): void {
    const currentCommand = this.terminalCommands[this.commandIndex];

    if (this.characterIndex < currentCommand.length) {
      this.characterIndex += 1;
      this.activeCommand.set(currentCommand.slice(0, this.characterIndex));
      this.scheduleViewportScroll();
      this.scheduleNextStep(65);
      return;
    }

    this.terminalHistory.update((history) => {
      const nextHistory = [...history, currentCommand];
      return nextHistory.slice(-24);
    });
    this.activeCommand.set('');
    this.characterIndex = 0;
    this.commandIndex = (this.commandIndex + 1) % this.terminalCommands.length;
    this.scheduleViewportScroll();
    this.scheduleNextStep(900);
  }

  private scheduleNextStep(delay: number): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => this.runTerminal(), delay);
  }

  private scheduleViewportScroll(): void {
    if (this.scrollFrameId !== null) {
      window.cancelAnimationFrame(this.scrollFrameId);
    }

    this.scrollFrameId = window.requestAnimationFrame(() => {
      const viewport = this.terminalViewport?.nativeElement;

      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
  }
}
