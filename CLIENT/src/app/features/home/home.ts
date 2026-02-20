import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { Register } from '../register/register';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected accountService = inject(AccountService);
  protected isRegister = signal<boolean>(false);

  toggleRegister(){
    this.isRegister.set(!this.isRegister());
  }
}
