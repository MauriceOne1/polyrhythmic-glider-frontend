import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ChoiceOption {
  readonly value: string;
  readonly label: string;
  readonly hint: string;
}

const ATTENDANCE_OPTIONS: ChoiceOption[] = [
  {
    value: 'yes',
    label: 'Si, ci sono',
    hint: 'Porto il setup e mi unisco alla jam.',
  },
  {
    value: 'maybe',
    label: 'Forse',
    hint: 'Tengo il posto caldo ma devo ancora confermare.',
  },
  {
    value: 'no',
    label: 'Stavolta no',
    hint: 'Non riesco a esserci, ma voglio restare nel giro.',
  },
];

const DEFAULT_FORM_VALUE = {
  name: '',
  email: '',
  attendance: '',
  discovery: '',
  genre: '',
  instrument: '',
  hasEffect: 'no',
  effectDetails: '',
  notes: '',
  rulesConfirmed: false,
  consent: false,
};

@Component({
  selector: 'app-participation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './participation.html',
  styleUrl: './participation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Participation {
  readonly formName = 'byos-participation';
  readonly eventDateLabel = '28.04.2026';
  readonly attendanceOptions = ATTENDANCE_OPTIONS;

  private readonly formBuilder = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly statusMessage = signal('');
  readonly statusKind = signal<'idle' | 'success' | 'error'>('idle');

  readonly form = this.formBuilder.nonNullable.group({
    name: [DEFAULT_FORM_VALUE.name, [Validators.required]],
    email: [DEFAULT_FORM_VALUE.email, [Validators.required, Validators.email]],
    attendance: [DEFAULT_FORM_VALUE.attendance, [Validators.required]],
    discovery: [DEFAULT_FORM_VALUE.discovery, [Validators.required]],
    genre: [DEFAULT_FORM_VALUE.genre, [Validators.required]],
    instrument: [DEFAULT_FORM_VALUE.instrument, [Validators.required]],
    hasEffect: [DEFAULT_FORM_VALUE.hasEffect, [Validators.required]],
    effectDetails: [DEFAULT_FORM_VALUE.effectDetails],
    notes: [DEFAULT_FORM_VALUE.notes],
    rulesConfirmed: [DEFAULT_FORM_VALUE.rulesConfirmed, [Validators.requiredTrue]],
    consent: [DEFAULT_FORM_VALUE.consent, [Validators.requiredTrue]],
  });

  constructor() {
    this.form.controls.hasEffect.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        if (value === 'yes') {
          this.form.controls.effectDetails.addValidators([Validators.required]);
        } else {
          this.form.controls.effectDetails.clearValidators();
          this.form.controls.effectDetails.setValue('');
          this.form.controls.effectDetails.markAsPristine();
          this.form.controls.effectDetails.markAsUntouched();
        }

        this.form.controls.effectDetails.updateValueAndValidity({
          emitEvent: false,
        });
      });
  }

  selectHasEffect(value: 'yes' | 'no'): void {
    this.form.controls.hasEffect.setValue(value);
    this.form.controls.hasEffect.markAsDirty();
    this.form.controls.hasEffect.markAsTouched();
  }

  selectAttendance(value: string): void {
    this.form.controls.attendance.setValue(value);
    this.form.controls.attendance.markAsDirty();
    this.form.controls.attendance.markAsTouched();
  }

  isEffectEnabled(): boolean {
    return this.form.controls.hasEffect.value === 'yes';
  }

  async submit(event: SubmitEvent): Promise<void> {
    if (this.form.invalid || this.isSubmitting()) {
      event.preventDefault();
      this.form.markAllAsTouched();
      return;
    }

    event.preventDefault();
    this.isSubmitting.set(true);
    this.statusMessage.set('');
    this.statusKind.set('idle');

    const formElement = event.target;

    if (!(formElement instanceof HTMLFormElement)) {
      this.statusKind.set('error');
      this.statusMessage.set('Invio non disponibile in questo momento.');
      this.isSubmitting.set(false);
      return;
    }

    const formData = new FormData(formElement);
    const encodedFormData = new URLSearchParams();

    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        encodedFormData.append(key, value);
      }
    });

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodedFormData.toString(),
      });

      if (!response.ok) {
        throw new Error('Participation form submission failed');
      }

      this.statusKind.set('success');
      this.statusMessage.set(
        'Perfetto, risposta ricevuta. Ti ricontatteremo con i dettagli della jam.'
      );
      this.resetForm();
    } catch {
      this.statusKind.set('error');
      this.statusMessage.set(
        'Invio non riuscito. Riprova tra un attimo oppure scrivi a info@polyglider.com.'
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  resetForm(): void {
    this.form.reset(DEFAULT_FORM_VALUE);
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
