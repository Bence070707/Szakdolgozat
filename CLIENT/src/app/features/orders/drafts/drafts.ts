import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../../types/Order';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { ToastService } from '../../../core/services/toast-service';
import { ConfirmService } from '../../../core/services/confirm-service';

@Component({
  selector: 'app-drafts',
  imports: [RouterLink, DatePipe],
  templateUrl: './drafts.html',
  styleUrl: './drafts.css',
})
export class Drafts implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmService);
  drafts = this.orderService.drafts;
  loading = this.orderService.draftsLoading;

  ngOnInit(): void {
    this.orderService.loadDrafts();
  }

  async confirmDeleteDraft(id: string){
    const ok = await this.confirmService.confirm('Biztosan törlöd a piszkozatot?');
    if(ok) this.deleteDraft(id);
  }

  deleteDraft(id: string) {
    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.toastService.success('Sikeresen törölve!')
        this.orderService.loadDrafts();
      },
      error: () => this.toastService.error('Hiba történt!')
    })
  }
}
