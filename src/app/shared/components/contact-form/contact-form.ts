import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReadableKeyPipe } from '../../pipes/readable-key.pipe';
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
  readonly formName = 'contact';
  readonly subjectOptions = CONTACT_SUBJECT_OPTIONS;
  readonly minimumMessageLength = MIN_MESSAGE_LENGTH;

  private readonly formBuilder = inject(FormBuilder);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly isSubmitting = signal(false);
  readonly isSubjectMenuOpen = signal(false);
  readonly statusMessage = signal('');
  readonly statusKind = signal<'idle' | 'success' | 'error'>('idle');
  readonly form = this.formBuilder.nonNullable.group({
    name: [createEmptyContactFormValue().name, [Validators.required]],
    email: [createEmptyContactFormValue().email, [Validators.required, Validators.email]],
    subject: [createEmptyContactFormValue().subject, [Validators.required]],
    message: [
      createEmptyContactFormValue().message,
      [Validators.required, Validators.minLength(MIN_MESSAGE_LENGTH)],
    ],
    consent: [createEmptyContactFormValue().consent, [Validators.requiredTrue]],
  });

  readonly messageLength = computed(() => this.form.controls.message.value.length);

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event): void {
    const target = event.target;

    if (
      target instanceof Node &&
      !this.elementRef.nativeElement.contains(target) &&
      this.isSubjectMenuOpen()
    ) {
      this.isSubjectMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.isSubjectMenuOpen.set(false);
  }

  toggleSubjectMenu(): void {
    this.isSubjectMenuOpen.update((isOpen) => !isOpen);
  }

  selectSubject(subject: string): void {
    this.form.controls.subject.setValue(subject);
    this.form.controls.subject.markAsDirty();
    this.form.controls.subject.markAsTouched();
    this.isSubjectMenuOpen.set(false);
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

    try {
      const encodedFormData = new URLSearchParams();

      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          encodedFormData.append(key, value);
        }
      });

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodedFormData.toString(),
      });

      if (!response.ok) {
        throw new Error('Netlify form submission failed');
      }

      this.statusKind.set('success');
      this.statusMessage.set('Messaggio inviato correttamente. Ti rispondero appena possibile.');
      this.form.reset(createEmptyContactFormValue());
      this.isSubjectMenuOpen.set(false);
      this.form.markAsPristine();
      this.form.markAsUntouched();
    } catch {
      this.statusKind.set('error');
      this.statusMessage.set(
        'Invio non riuscito. Riprova tra un attimo o scrivi a info@polyglider.com.',
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  resetForm(): void {
    this.form.reset(createEmptyContactFormValue());
    this.isSubjectMenuOpen.set(false);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.statusMessage.set('');
    this.statusKind.set('idle');
  }
}
