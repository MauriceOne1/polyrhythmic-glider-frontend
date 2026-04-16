import { Injectable, signal } from '@angular/core';

export type ToastTone = 'info' | 'warning';

export interface ToastMessage {
  readonly id: string;
  readonly eyebrow?: string;
  readonly title: string;
  readonly message: string;
  readonly tone: ToastTone;
  readonly dismissible?: boolean;
  readonly durationMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly messages = signal<ToastMessage[]>([]);

  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  show(message: ToastMessage): void {
    this.clearTimer(message.id);

    this.messages.update((messages) => [
      message,
      ...messages.filter((item) => item.id !== message.id),
    ]);

    const durationMs = message.durationMs ?? 10000;

    if (durationMs > 0) {
      this.timers.set(
        message.id,
        setTimeout(() => this.dismiss(message.id), durationMs)
      );
    }
  }

  dismiss(id: string): void {
    this.clearTimer(id);
    this.messages.update((messages) =>
      messages.filter((message) => message.id !== id)
    );
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);

    if (!timer) {
      return;
    }

    clearTimeout(timer);
    this.timers.delete(id);
  }
}
