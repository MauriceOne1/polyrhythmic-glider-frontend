import type { ContactFormValue } from '../models/contact-form.models';

export const CONTACT_SUBJECT_OPTIONS = [
  'dj-sets',
  'sound-design',
  'creative-coding',
  'collaboration',
];

export const MIN_MESSAGE_LENGTH = 24;

export function createEmptyContactFormValue(): ContactFormValue {
  return {
    name: '',
    email: '',
    subject: CONTACT_SUBJECT_OPTIONS[0],
    message: '',
    consent: false,
  };
}
