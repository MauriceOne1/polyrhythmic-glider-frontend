import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReadableKeyPipe } from '../../pipes/readable-key.pipe';
import { ContactTestService } from '../../services/contact-test.service';
import {
  CONTACT_SUBJECT_OPTIONS,
  MIN_MESSAGE_LENGTH,
  createEmptyContactFormValue,
} from '../../utils/contact-form.utils';

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, ReactiveFormsModule, ReadableKeyPipe],
  templateUrl: './contact-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactForm {
  readonly subjectOptions = CONTACT_SUBJECT_OPTIONS;
  readonly minimumMessageLength = MIN_MESSAGE_LENGTH;

  private readonly formBuilder = inject(FormBuilder);
  private readonly contactTestService = inject(ContactTestService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isSubmitting = signal(false);
  readonly successMessage = signal('');
  readonly latestSubmission = this.contactTestService.latestSubmission;
  readonly form = this.formBuilder.nonNullable.group({
    name: [createEmptyContactFormValue().name, [Validators.required]],
    email: [
      createEmptyContactFormValue().email,
      [Validators.required, Validators.email],
    ],
    subject: [createEmptyContactFormValue().subject, [Validators.required]],
    message: [
      createEmptyContactFormValue().message,
      [Validators.required, Validators.minLength(MIN_MESSAGE_LENGTH)],
    ],
    consent: [createEmptyContactFormValue().consent, [Validators.requiredTrue]],
  });

  readonly messageLength = computed(() => this.form.controls.message.value.length);

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set('');

    this.contactTestService
      .submit(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ estimatedReplyWindow }) => {
          this.successMessage.set(
            `Messaggio simulato inviato con successo, risposta prevista ${estimatedReplyWindow}.`
          );
          this.form.reset(createEmptyContactFormValue());
          this.isSubmitting.set(false);
        },
        error: () => {
          this.successMessage.set(
            'La simulazione non e riuscita, riprova tra un attimo.'
          );
          this.isSubmitting.set(false);
        },
      });
  }

  resetForm(): void {
    this.form.reset(createEmptyContactFormValue());
    this.successMessage.set('');
  }
}
