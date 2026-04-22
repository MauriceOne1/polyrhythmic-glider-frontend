import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IdentityService } from './identity.service';
import { getCurrentAbsoluteUrl } from '../../shared/utils/host.utils';

export const identityGuard: CanActivateFn = async (_route, state) => {
  const identity = inject(IdentityService);
  const router = inject(Router);
  const user = await identity.resolveCurrentUser();

  if (user) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { redirectTo: getCurrentAbsoluteUrl() || state.url || '/admin' },
  });
};
