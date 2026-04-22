import { ChangeDetectionStrategy, Component, OnInit, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ErrorStateAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface ErrorStateMessage {
  text: string;
  accent?: string;
}

const DEFAULT_MESSAGE_ACCENTS = [
  '(ಥ﹏ಥ)',
  '¯\\_(ツ)_/¯',
  'ಥ_ಥ',
  '⊙﹏⊙',
  '¯\\_(⊙︿⊙)_/¯',
  'ಠ╭╮ಠ',
  '¿ⓧ_ⓧﮌ',
  '(⊙.☉)7',
  '(´･_･`)',
  '٩(๏_๏)۶',
  '(ಥ⌣ಥ)',
  '｡ﾟ( ﾟஇ‸இﾟ)ﾟ｡',
  '༼ ༎ຶ ෴ ༎ຶ༽',
  '눈_눈',
];

@Component({
  selector: 'app-error-state',
  imports: [RouterLink],
  templateUrl: './error-state.html',
  styleUrl: './error-state.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorState implements OnInit {
  readonly eyebrow = input('system.status');
  readonly code = input.required<string>();
  readonly title = input.required<string>();
  readonly messages = input<Array<string | ErrorStateMessage>>([]);
  readonly primaryAction = input.required<ErrorStateAction>();
  readonly secondaryAction = input<ErrorStateAction | null>(null);

  readonly activeMessageIndex = signal(0);
  readonly activeMessage = computed<ErrorStateMessage | null>(() => {
    const message = this.messages()[this.activeMessageIndex()];

    if (!message) {
      return null;
    }

    return typeof message === 'string' ? { text: message } : message;
  });
  readonly activeMessageAccent = computed(() => {
    const message = this.activeMessage();

    if (!message) {
      return '';
    }

    return (
      message.accent ??
      DEFAULT_MESSAGE_ACCENTS[this.activeMessageIndex() % DEFAULT_MESSAGE_ACCENTS.length] ??
      ''
    );
  });
  readonly hasMultipleMessages = computed(() => this.messages().length > 1);

  ngOnInit(): void {
    const messages = this.messages();

    if (messages.length > 1) {
      this.activeMessageIndex.set(Math.floor(Math.random() * messages.length));
    }
  }

  showPreviousMessage(): void {
    const messages = this.messages();

    if (messages.length < 2) {
      return;
    }

    this.activeMessageIndex.update((index) => (index - 1 + messages.length) % messages.length);
  }

  showNextMessage(): void {
    const messages = this.messages();

    if (messages.length < 2) {
      return;
    }

    this.activeMessageIndex.update((index) => (index + 1) % messages.length);
  }
}
