import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../../core/identity/identity.service';
import { ToastService } from '../../core/toast/toast.service';

type LoginMode = 'login' | 'forgot' | 'reset' | 'invite' | 'status';
type StatusKind = 'idle' | 'success' | 'error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnDestroy {
  readonly identity = inject(IdentityService);
  readonly mode = signal<LoginMode>(this.getInitialMode());
  readonly isSubmitting = signal(false);
  readonly statusKind = signal<StatusKind>('idle');
  readonly statusMessage = signal('');
  readonly isPasswordAction = computed(() =>
    this.mode() === 'reset' || this.mode() === 'invite'
  );

  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');

  readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly forgotForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.formBuilder.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required]],
  });

  constructor() {
    this.identity.setPostLoginRedirect(this.redirectTo);
    this.showRouteNotice();
    this.identity.init();

    effect(() => {
      const callback = this.identity.callbackResult();

      if (!callback) {
        return;
      }

      if (callback.type === 'recovery') {
        this.mode.set('reset');
        this.setStatus('success', 'Scegli una nuova password per completare il recupero.');
        return;
      }

      if (callback.type === 'invite') {
        this.mode.set('invite');
        this.setStatus('success', 'Crea la password per attivare il tuo account.');
        return;
      }

      this.mode.set('status');
      this.setStatus('success', 'Accesso confermato. Ti porto alla pagina richiesta.');
      void this.navigateAfterCallback();
    });

    void this.redirectAuthenticatedUser();
  }

  ngOnDestroy(): void {
    this.toast.dismiss('polyblog-construction');
  }

  setMode(mode: LoginMode): void {
    this.mode.set(mode);
    this.identity.authError.set('');
    this.setStatus('idle', '');
  }

  async submitLogin(): Promise<void> {
    if (this.loginForm.invalid || this.isSubmitting()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.setStatus('idle', '');

    try {
      const { email, password } = this.loginForm.getRawValue();
      await this.identity.loginWithPassword(email, password);
    } catch {
      this.setStatus('idle', '');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async submitForgot(): Promise<void> {
    if (this.forgotForm.invalid || this.isSubmitting()) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.setStatus('idle', '');

    try {
      const { email } = this.forgotForm.getRawValue();
      await this.identity.sendPasswordRecovery(email);
      this.setStatus(
        'success',
        'Se questa email esiste, riceverai il link per scegliere una nuova password.'
      );
    } catch {
      this.setStatus('idle', '');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async submitPasswordAction(): Promise<void> {
    if (this.passwordForm.invalid || this.isSubmitting()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { password, passwordConfirm } = this.passwordForm.getRawValue();

    if (password !== passwordConfirm) {
      this.passwordForm.controls.passwordConfirm.setErrors({ mismatch: true });
      this.passwordForm.controls.passwordConfirm.markAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.setStatus('idle', '');

    try {
      if (this.mode() === 'invite') {
        await this.identity.acceptInviteWithPassword(password);
      } else {
        await this.identity.updateRecoveredPassword(password);
      }
    } catch {
      this.setStatus('idle', '');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private getInitialMode(): LoginMode {
    if (typeof window === 'undefined') {
      return 'login';
    }

    const { hash } = window.location;

    if (hash.includes('recovery_token=')) {
      return 'reset';
    }

    if (hash.includes('invite_token=')) {
      return 'invite';
    }

    if (
      hash.includes('confirmation_token=') ||
      hash.includes('email_change_token=') ||
      hash.includes('access_token=')
    ) {
      return 'status';
    }

    return 'login';
  }

  private async redirectAuthenticatedUser(): Promise<void> {
    const user = await this.identity.resolveCurrentUser();
    const callbackType = this.identity.callbackResult()?.type;

    if (
      !user ||
      callbackType === 'recovery' ||
      callbackType === 'invite' ||
      this.isPasswordAction()
    ) {
      return;
    }

    await this.router.navigateByUrl(this.redirectTo || '/');
  }

  private async navigateAfterCallback(): Promise<void> {
    const user = await this.identity.resolveCurrentUser();

    if (!user) {
      return;
    }

    await this.router.navigateByUrl(this.redirectTo || '/');
  }

  private setStatus(kind: StatusKind, message: string): void {
    this.statusKind.set(kind);
    this.statusMessage.set(message);
  }

  private showRouteNotice(): void {
    if (
      this.route.snapshot.queryParamMap.get('notice') !==
      'polyblog-construction'
    ) {
      return;
    }

    this.toast.show({
      id: 'polyblog-construction',
      eyebrow: 'auth_required',
      title: 'Route protetta.',
      message: 'Esegui il login per continuare.',
      tone: 'warning',
      durationMs: 0,
    });
  }
}
