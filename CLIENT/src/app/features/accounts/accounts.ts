import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { AdminService } from '../../core/services/admin-service';
import { ManageUsers } from './manage-users/manage-users';

@Component({
  selector: 'app-accounts',
  imports: [ManageUsers],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
protected accountSerivce = inject(AccountService);
activeTab = 'roles';
tabs = [
  {label: 'Fiókok kezelése', value: 'roles'}
]

setTab(tab: string){
  this.activeTab = tab;
}
}
