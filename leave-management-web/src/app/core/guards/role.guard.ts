import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'] as string;
  const userRole = authService.getRole();

  if (userRole === expectedRole) {
    return true;
  }

  // Redirect to correct dashboard if role mismatch
  if (userRole === 'EMPLOYEE') {
    return router.createUrlTree(['/employee/dashboard']);
  } else if (userRole === 'MANAGER') {
    return router.createUrlTree(['/manager/dashboard']);
  }

  return router.createUrlTree(['/unauthorized']);
};

