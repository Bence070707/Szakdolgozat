import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../../types/Order';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-drafts',
  imports: [RouterLink, DatePipe],
  templateUrl: './drafts.html',
  styleUrl: './drafts.css',
})
export class Drafts implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  drafts = this.orderService.drafts;
  loading = this.orderService.draftsLoading;

  ngOnInit(): void {
    this.orderService.loadDrafts();
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
