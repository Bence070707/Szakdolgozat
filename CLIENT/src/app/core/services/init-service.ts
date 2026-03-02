import { inject, Injectable } from '@angular/core';
import { AccountService } from './account-service';
import { tap } from 'rxjs';
import { StockMovementService } from './stock-movement-service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  private accountService = inject(AccountService);
  private stocksService = inject(StockMovementService);


  init() {
    return this.accountService.refreshToken().pipe(
      tap(user => {
        if (user) {
          this.accountService.setCurrentUser(user);
          this.accountService.automatedRefreshTokenRequest();
          this.stocksService.initApprovalCount();
        }
      })
    )
  }
}
