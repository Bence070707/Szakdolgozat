import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { AdminService } from '../../core/services/admin-service';
import { ManageUsers } from './manage-users/manage-users';
import { ManageRegistrations } from './manage-registrations/manage-registrations';

@Component({
  selector: 'app-accounts',
  imports: [ManageUsers, ManageRegistrations],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class Accounts {
protected accountSerivce = inject(AccountService);
activeTab = 'roles';
tabs = [
  {label: 'Szerepkörök kezelése', value: 'roles'},
  {label: 'Regisztrációk kezelése', value: 'registrations'}
]

setTab(tab: string){
  this.activeTab = tab;
}
}
