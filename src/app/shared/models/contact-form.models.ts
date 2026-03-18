export interface ContactFormValue {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
}

export interface ContactSubmission extends ContactFormValue {
  id: string;
  submittedAt: string;
}

export interface ContactSubmissionResult {
  success: true;
  submission: ContactSubmission;
  estimatedReplyWindow: string;
}
