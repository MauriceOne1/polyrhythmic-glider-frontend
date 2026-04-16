import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../../core/identity/identity.service';
import { ToastService } from '../../core/toast/toast.service';

type IdentityAction = 'confirmation' | 'recovery' | 'invite' | 'email-change';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  readonly identity = inject(IdentityService);
  readonly identityAction = this.readIdentityAction();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  constructor() {
    this.identity.setPostLoginRedirect(
      this.route.snapshot.queryParamMap.get('redirectTo')
    );

    if (this.identity.currentUser() && !this.identityAction) {
      void this.router.navigateByUrl(
        this.route.snapshot.queryParamMap.get('redirectTo') || '/'
      );
      return;
    }

    this.showRouteNotice();
    this.identity.init();

    if (this.identityAction) {
      this.identity.openIdentityAction();
      return;
    }

    this.identity.openLogin();
  }

  ngOnDestroy(): void {
    this.toast.dismiss('polyblog-construction');
    this.identity.closeWidget();
  }

  openLogin(): void {
    this.identity.openLogin();
  }

  openSignup(): void {
    this.identity.openSignup();
  }

  openIdentityAction(): void {
    this.identity.openIdentityAction();
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
      eyebrow: 'access denied',
      title: 'Questa pagina è in costruzione.',
      message: 'Per accederci devi essere autenticato.',
      tone: 'warning',
      dismissible: false,
      durationMs: 0,
    });
  }

  private readIdentityAction(): IdentityAction | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const { hash } = window.location;

    if (hash.includes('recovery_token=')) {
      return 'recovery';
    }

    if (hash.includes('invite_token=')) {
      return 'invite';
    }

    if (hash.includes('confirmation_token=')) {
      return 'confirmation';
    }

    if (hash.includes('email_change_token=')) {
      return 'email-change';
    }

    return null;
  }
}
