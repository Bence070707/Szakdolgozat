import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const toastService = inject(ToastService);

  if(accountService.currentUser() && accountService.currentUser()?.roles.includes('Admin')){
    return true;
  }

  toastService.error('Csak admin felhasználóknak engedélyezett felület!');
  return false;
};
