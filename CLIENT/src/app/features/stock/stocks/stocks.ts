import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from "@angular/router";
import { AccountService } from '../../../core/services/account-service';
import { NgClass } from '@angular/common';
import { StockMovementService } from '../../../core/services/stock-movement-service';

@Component({
  selector: 'app-stocks',
  imports: [RouterLink, RouterOutlet, RouterLinkActive, NgClass],
  templateUrl: './stocks.html',
  styleUrl: './stocks.css',
})
export class Stocks implements OnInit {
  protected accountService = inject(AccountService);
  protected stocksService = inject(StockMovementService);
  protected isAdmin = computed<boolean>(() => {
    return this.accountService.currentUser()?.roles.includes('Admin') ? true : false;
  });

  ngOnInit(): void {
    this.stocksService.initApprovalCount();
  }
}
