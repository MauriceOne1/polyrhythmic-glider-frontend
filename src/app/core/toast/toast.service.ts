import { Injectable, signal } from '@angular/core';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface ToastMessage {
  readonly id: string;
  readonly eyebrow?: string;
  readonly title: string;
  readonly message: string;
  readonly tone: ToastTone;
  readonly dismissible?: boolean;
  readonly durationMs?: number;
  readonly createdAt: number;
}

export type ToastRequest = Omit<ToastMessage, 'createdAt' | 'id'> & {
  readonly id?: string;
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly messages = signal<ToastMessage[]>([]);

  private readonly maxVisibleMessages = 5;
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly delayedTimers = new Map<string, ReturnType<typeof setTimeout>>();

  show(request: ToastRequest): string {
    const message = this.createMessage(request);

    this.clearTimer(message.id);
    this.clearDelayedTimer(message.id);
    this.messages.update((messages) =>
      [message, ...messages.filter((item) => item.id !== message.id)].slice(
        0,
        this.maxVisibleMessages,
      ),
    );

    const durationMs = message.durationMs ?? 10000;

    if (durationMs > 0) {
      this.timers.set(
        message.id,
        setTimeout(() => this.dismiss(message.id), durationMs),
      );
    }

    return message.id;
  }

  showAfter(request: ToastRequest, delayMs: number): string {
    const message = this.createMessage(request);
    const delay = Math.max(0, delayMs);

    this.clearTimer(message.id);
    this.clearDelayedTimer(message.id);

    if (delay === 0) {
      return this.show(message);
    }

    this.delayedTimers.set(
      message.id,
      setTimeout(() => {
        this.delayedTimers.delete(message.id);
        this.show(message);
      }, delay),
    );

    return message.id;
  }

  info(request: Omit<ToastRequest, 'tone'>): string {
    return this.show({ ...request, tone: 'info' });
  }

  success(request: Omit<ToastRequest, 'tone'>): string {
    return this.show({ ...request, tone: 'success' });
  }

  warning(request: Omit<ToastRequest, 'tone'>): string {
    return this.show({ ...request, tone: 'warning' });
  }

  danger(request: Omit<ToastRequest, 'tone'>): string {
    return this.show({ ...request, tone: 'danger' });
  }

  neutral(request: Omit<ToastRequest, 'tone'>): string {
    return this.show({ ...request, tone: 'neutral' });
  }

  dismiss(id: string): void {
    this.clearTimer(id);
    this.clearDelayedTimer(id);
    this.messages.update((messages) => messages.filter((message) => message.id !== id));
  }

  clearAll(): void {
    for (const id of Array.from(this.timers.keys())) {
      this.clearTimer(id);
    }

    for (const id of Array.from(this.delayedTimers.keys())) {
      this.clearDelayedTimer(id);
    }

    this.messages.set([]);
  }

  private createMessage(request: ToastRequest): ToastMessage {
    return {
      dismissible: true,
      durationMs: 10000,
      ...request,
      id: request.id?.trim() || this.createId(),
      tone: request.tone,
      createdAt: Date.now(),
    };
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);

    if (!timer) {
      return;
    }

    clearTimeout(timer);
    this.timers.delete(id);
  }

  private clearDelayedTimer(id: string): void {
    const timer = this.delayedTimers.get(id);

    if (!timer) {
      return;
    }

    clearTimeout(timer);
    this.delayedTimers.delete(id);
  }
}
