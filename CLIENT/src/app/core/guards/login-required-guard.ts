import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';

export const loginRequiredGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  if (accountService.currentUser() && (accountService.currentUser()?.roles.includes('Manager')
    || accountService.currentUser()?.roles.includes('Admin'))) {
    return true;
  }

  toastService.error('Csak bejelentkezett felhasználóknak engedélyezett felület!');
  router.navigateByUrl("/");
  return false;
};
