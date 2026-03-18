import { Injectable, computed, signal } from '@angular/core';
import { delay, map, of, tap } from 'rxjs';
import type {
  ContactSubmission,
  ContactSubmissionResult,
  ContactFormValue,
} from '../models/contact-form.models';
import { getReplyWindow } from '../utils/contact-form.utils';
import { createSubmissionId } from '../utils/string.utils';

@Injectable({
  providedIn: 'root',
})
export class ContactTestService {
  private readonly submissionsState = signal<ContactSubmission[]>([]);

  readonly submissions = computed(() => this.submissionsState());
  readonly latestSubmission = computed(() => this.submissionsState()[0] ?? null);

  submit(formValue: ContactFormValue) {
    const submission: ContactSubmission = {
      ...formValue,
      id: createSubmissionId(),
      submittedAt: new Date().toISOString(),
    };

    return of(submission).pipe(
      delay(650),
      tap((record) => {
        this.submissionsState.update((current) => [record, ...current]);
      }),
      map((record): ContactSubmissionResult => ({
        success: true,
        submission: record,
        estimatedReplyWindow: getReplyWindow(record.subject),
      }))
    );
  }
}
