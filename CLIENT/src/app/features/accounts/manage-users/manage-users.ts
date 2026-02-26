import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AdminService } from '../../../core/services/admin-service';
import { ManagedUser } from '../../../../types/User';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-manage-users',
  imports: [],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers implements OnInit {
  @ViewChild('rolesModal') rolesModal!: ElementRef<HTMLDialogElement>;
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);
  protected users = signal<ManagedUser[]>([]);
  protected roles = ['Manager', 'Admin'];
  protected selectedUser: ManagedUser | null = null;
  
  ngOnInit(): void {
    this.getUserRoles();
  }

  getUserRoles() {
    this.adminService.getUserRoles().subscribe({
      next: response => {
        this.users.set(response);
      },
      error: () => {
        this.toastService.error('Valami hiba történt a kérés során.')
      }
    })
  }

  openRolesModal(user: ManagedUser){
    this.selectedUser = user;
    this.rolesModal.nativeElement.showModal();
  }

  toggleRole(event: Event, role: string){
    if(!this.selectedUser) return;
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
      this.selectedUser.roles.push(role)
    }else{
      this.selectedUser.roles = this.selectedUser.roles.filter(r => r !== role)
    }
  }

  updateRoles(){
    if(!this.selectedUser) return;
    this.adminService.editUserRoles(this.selectedUser.id, this.selectedUser.roles).subscribe({
      next: roles => {
        this.users.update(users => users.map(u => {
          if(u.id === this.selectedUser?.id) u.roles = roles;
          return u;
        }))
        this.rolesModal.nativeElement.close();
        this.toastService.success('Szerepkörök sikeresen frissítve');
      },
      error: () => this.toastService.error('Hiba történt a szerepkörök mentése során')
      
    })
  }

  toggleArchive(user: ManagedUser){
    const request$ = user.isArchived
      ? this.adminService.unarchiveUser(user.id)
      : this.adminService.archiveUser(user.id);

    request$.subscribe({
      next: () => {
        this.users.update(users => users.map(u => {
          if (u.id !== user.id) return u;

          return {
            ...u,
            isArchived: !u.isArchived,
            archivedAt: u.isArchived ? null : new Date().toISOString()
          }
        }));

        this.toastService.success(user.isArchived ? 'Fiók visszaállítva' : 'Fiók archiválva');
      },
      error: () => this.toastService.error('Hiba történt a művelet során')
    })
  }
}
