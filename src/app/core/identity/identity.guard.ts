import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IdentityService } from './identity.service';

export const identityGuard: CanActivateFn = async () => {
  const identity = inject(IdentityService);
  const router = inject(Router);
  const user = await identity.resolveCurrentUser();

  if (user) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { redirectTo: '/admin' },
  });
};
