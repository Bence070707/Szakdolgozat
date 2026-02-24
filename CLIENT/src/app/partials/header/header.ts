import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { BusyService } from '../../core/services/busy-service';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected busyService = inject(BusyService);
  protected accountService = inject(AccountService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  protected creds: any = {};

  login(){
    this.accountService.login(this.creds).subscribe({
      next: response => {
        this.creds = {};
        this.toastService.success('Sikeresen bejelentkezett.');
      },
      error: err => {
        console.log(err);
        this.toastService.error('Valami hiba történt bejelentkezés során.');
      }
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
