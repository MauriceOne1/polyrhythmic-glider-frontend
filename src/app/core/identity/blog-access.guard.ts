import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IdentityService } from './identity.service';

export const blogAccessGuard: CanActivateFn = async (_route, state) => {
  if (isLocalBlogPreview()) {
    return true;
  }

  const identity = inject(IdentityService);
  const router = inject(Router);
  const user = await identity.resolveCurrentUser();

  if (user) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: {
      redirectTo: state.url,
      notice: 'polyblog-construction',
    },
  });
};

function isLocalBlogPreview(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
}
