import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ToastRequest,
  ToastService,
  ToastTone,
} from '../../../../core/toast/toast.service';

interface ToastToneOption {
  readonly value: ToastTone;
  readonly label: string;
  readonly hint: string;
  readonly textClass: string;
}

interface ToastPreset {
  readonly tone: ToastTone;
  readonly eyebrow: string;
  readonly title: string;
  readonly message: string;
}

const TOAST_PRESETS: ToastPreset[] = [
  {
    tone: 'info',
    eyebrow: 'info',
    title: 'Sincronizzazione avviata.',
    message: 'Sto aggiornando i dati del pannello in background.',
  },
  {
    tone: 'success',
    eyebrow: 'success',
    title: 'Modifica salvata.',
    message: 'Le impostazioni sono state applicate correttamente.',
  },
  {
    tone: 'warning',
    eyebrow: 'warning',
    title: 'Controlla i campi.',
    message: "Alcuni dati sembrano incompleti prima dell'invio.",
  },
  {
    tone: 'danger',
    eyebrow: 'danger',
    title: 'Invio non riuscito.',
    message: 'Il server non ha risposto. Riprova tra qualche secondo.',
  },
  {
    tone: 'neutral',
    eyebrow: 'system',
    title: 'Evento registrato.',
    message: 'La notifica è stata aggiunta allo stream corrente.',
  },
];

const TONE_OPTIONS: ToastToneOption[] = [
  {
    value: 'info',
    label: 'Information',
    hint: 'Aggiornamenti neutri, stato del sistema, conferme leggere.',
    textClass: 'text-sky-300',
  },
  {
    value: 'success',
    label: 'Success',
    hint: 'Azioni concluse, salvataggi, invii riusciti.',
    textClass: 'text-emerald-300',
  },
  {
    value: 'warning',
    label: 'Warning',
    hint: 'Attenzione richiesta senza bloccare il flusso.',
    textClass: 'text-amber-300',
  },
  {
    value: 'danger',
    label: 'Danger',
    hint: 'Errori, blocchi, operazioni non riuscite.',
    textClass: 'text-rose-300',
  },
  {
    value: 'neutral',
    label: 'Neutral',
    hint: 'Messaggi tecnici, log, note di servizio.',
    textClass: 'text-slate-300',
  },
];



@Component({
  selector: 'app-toast-launcher',
  imports: [ReactiveFormsModule],
  templateUrl: './toast-launcher.html',
  styleUrl: './toast-launcher.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastLauncher {
  private readonly formBuilder = inject(FormBuilder);
  readonly toast = inject(ToastService);

  readonly toneOptions = TONE_OPTIONS;
  readonly presets = TOAST_PRESETS;
  readonly lastToastId = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    tone: this.formBuilder.nonNullable.control<ToastTone>('info', {
      validators: [Validators.required],
    }),
    eyebrow: ['demo'],
    title: ['Toast playground', [Validators.required, Validators.maxLength(80)]],
    message: [
      'Questo messaggio e generato dal laboratorio toast.',
      [Validators.required, Validators.maxLength(180)],
    ],
    durationMs: [
      6000,
      [Validators.required, Validators.min(0), Validators.max(60000)],
    ],
    delayMs: [
      0,
      [Validators.required, Validators.min(0), Validators.max(30000)],
    ],
    toastId: [''],
    dismissible: [true],
  });

  launchFromForm(event: SubmitEvent): void {
    event.preventDefault();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.launch(this.buildRequestFromForm());
  }

  launchPreset(preset: ToastPreset): void {
    const formValue = this.form.getRawValue();

    this.launch({
      ...preset,
      id: this.normalizeOptionalText(formValue.toastId),
      durationMs: this.normalizeMilliseconds(formValue.durationMs),
      dismissible: formValue.dismissible,
    });
  }

  loadPreset(preset: ToastPreset): void {
    this.form.patchValue({
      tone: preset.tone,
      eyebrow: preset.eyebrow,
      title: preset.title,
      message: preset.message,
    });
  }

  launchTone(tone: ToastTone): void {
    const option = this.toneOptions.find((item) => item.value === tone);

    this.launch({
      tone,
      eyebrow: tone,
      title: option?.label ?? 'Toast',
      message: option?.hint ?? 'Notifica generata dal laboratorio toast.',
      durationMs: this.normalizeMilliseconds(this.form.controls.durationMs.value),
      dismissible: this.form.controls.dismissible.value,
    });
  }

  launchStack(): void {
    const delayStep = 180;

    this.presets.forEach((preset, index) => {
      const id = this.toast.showAfter(
        {
          ...preset,
          id: `toast-stack-${preset.tone}`,
          durationMs: this.normalizeMilliseconds(this.form.controls.durationMs.value),
          dismissible: this.form.controls.dismissible.value,
        },
        index * delayStep
      );

      if (index === this.presets.length - 1) {
        this.lastToastId.set(id);
      }
    });
  }

  clearAll(): void {
    this.toast.clearAll();
    this.lastToastId.set('');
  }

  private buildRequestFromForm(): ToastRequest {
    const value = this.form.getRawValue();

    return {
      id: this.normalizeOptionalText(value.toastId),
      tone: value.tone,
      eyebrow: this.normalizeOptionalText(value.eyebrow),
      title: value.title.trim(),
      message: value.message.trim(),
      durationMs: this.normalizeMilliseconds(value.durationMs),
      dismissible: value.dismissible,
    };
  }

  private launch(request: ToastRequest): void {
    const delayMs = this.normalizeMilliseconds(this.form.controls.delayMs.value);
    const id =
      delayMs > 0
        ? this.toast.showAfter(request, delayMs)
        : this.toast.show(request);

    this.lastToastId.set(id);
  }

  private normalizeOptionalText(value: string): string | undefined {
    const trimmedValue = value.trim();
    return trimmedValue || undefined;
  }

  private normalizeMilliseconds(value: number): number {
    return Math.round(Math.min(60000, Math.max(0, Number(value) || 0)));
  }


  readonly isToneMenuOpen = signal(false);

  toggleToneMenu(): void {
    this.isToneMenuOpen.update(open => !open);
  }

  closeToneMenu(): void {
    this.isToneMenuOpen.set(false);
  }

  selectTone(value: ToastTone): void {
    this.form.controls.tone.setValue(value);
    this.form.controls.tone.markAsDirty();
    this.form.controls.tone.markAsTouched();
    this.closeToneMenu();
  }

 getToneOption(value: ToastTone | null): ToastToneOption | undefined {
  return this.toneOptions.find(t => t.value === value);
}

getToneTextClass(value: ToastTone | null): string {
  return this.getToneOption(value)?.textClass ?? '';
}

getToneLabel(value: ToastTone | null): string {
  return this.getToneOption(value)?.label ?? 'Seleziona tipo';
}

getToneHint(value: ToastTone | null): string {
  return this.getToneOption(value)?.hint ?? '';
}
}
