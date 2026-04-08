import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../../core/identity/identity.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  readonly identity = inject(IdentityService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

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

    this.identity.init();

    if (this.hasIdentityHash()) {
      return;
    }

    this.identity.openLogin();
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
