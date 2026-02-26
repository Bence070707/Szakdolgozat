import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from "@angular/router";
import { AccountService } from '../../../core/services/account-service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-stocks',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, NgClass],
  templateUrl: './stocks.html',
  styleUrl: './stocks.css',
})
export class Stocks {
  protected accountService = inject(AccountService);
  protected isAdmin = computed<boolean>(() => {
    return this.accountService.currentUser()?.roles.includes('Admin') ? true : false;
  });
}
