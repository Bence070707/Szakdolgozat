import { Component, inject, output } from '@angular/core';
import { RegisterCreds } from '../../../types/User';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected creds: RegisterCreds = {} as RegisterCreds;
  private accountService = inject(AccountService);
  private toastService = inject(ToastService);
  toggleRegister = output();

  register() {
    this.accountService.register(this.creds).subscribe({
      next: () =>
        {
          this.toastService.success('Sikeresen bejelentkezett!');
          this.toggleRegister.emit();
        },
      error: error => {
        console.log(error)
        this.toastService.error('Valami hiba történt regisztráció során!')
      }
    })
  }

  toggleReg() {
    this.toggleRegister.emit();
  }
}
