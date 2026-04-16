import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../../core/identity/identity.service';
import { ToastService } from '../../core/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  readonly identity = inject(IdentityService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  constructor() {
    this.identity.setPostLoginRedirect(
      this.route.snapshot.queryParamMap.get('redirectTo')
    );

    if (this.identity.currentUser()) {
      void this.router.navigateByUrl(
        this.route.snapshot.queryParamMap.get('redirectTo') || '/'
      );
      return;
    }

    this.showRouteNotice();
    this.identity.init();

    if (this.hasIdentityHash()) {
      return;
    }

    this.identity.openLogin();
  }

  ngOnDestroy(): void {
    this.toast.dismiss('polyblog-construction');
    this.identity.closeWidget();
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

  private hasIdentityHash(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const { hash } = window.location;

    return (
      hash.includes('confirmation_token=') ||
      hash.includes('recovery_token=') ||
      hash.includes('invite_token=') ||
      hash.includes('email_change_token=')
    );
  }
}
