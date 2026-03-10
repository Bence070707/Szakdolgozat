import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmService } from '../../../core/services/confirm-service';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountService = inject(AccountService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  email = "";
  token = "";
  form = this.fb.nonNullable.group({
    password: ["", [Validators.required]],
    passwordAgain: ["", [Validators.required]]
  },
    {
      validators: [this.passwordsMatchValidator.bind(this)]
    })

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params["email"];
      this.token = params["token"];
    })
  }

  async confirmSubmit() {
    const ok = await this.confirmService.confirm('Biztosan véglegesíted?');
    if (ok) this.submit();
  }

  submit() {
    if (this.form.valid) {
      const dto = {
        email: this.email,
        token: this.token,
        newPassword: this.form.get("password")?.value || ""
      }
      console.log(dto);
      
      this.accountService.sendResetPassword(dto).subscribe({
        next: () => {
          this.toastService.success('Sikeres jelszóváltoztatás<br>Most már bejelentkezhet!');
          this.router.navigateByUrl('/');
        },
        error: err => {
          console.log(err);
          this.toastService.error('Valami hiba történt.<br>Próbálja újra.');
          this.router.navigateByUrl('/forgot-password');
        }
      })
    }
  }

  passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const passwordAgain = group.get('passwordAgain')?.value;

    if (password === passwordAgain) {
      return null;
    }

    return { passwordMismatch: true };
  }
}
