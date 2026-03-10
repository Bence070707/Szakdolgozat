import { Component, inject, signal } from '@angular/core';
import { ConfirmService } from '../../../core/services/confirm-service';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { ForgotPasswordDto } from '../../../../types/ForgotPasswordDto';

@Component({
  selector: 'app-forgot-password',
  imports: [],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  protected email = signal<ForgotPasswordDto>({ email: '' });
  private confirmService = inject(ConfirmService);
  private toastService = inject(ToastService);
  private accountsService = inject(AccountService);

  async confirmSubmit() {
    const ok = await this.confirmService.confirm(`Biztosan helyes a(z) ${this.email()?.email} email cím?`)
    if (ok) this.submit()
  }

  submit() {
    if (this.email()?.email) {
      const email = this.email()?.email
      this.accountsService.sendForgotPasswordEmail(email!).subscribe({
        next: () => {
          this.toastService.success("Email sikeresen elküldve!");
        },
        error: err => console.log(err)

      })
    }
  }
}
