import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { PaginatedResult } from '../../../../types/Pagination';
import { Order } from '../../../../types/Order';
import { ToastService } from '../../../core/services/toast-service';
import { DatePipe } from '@angular/common';
import { PurchaseOrderStatusPipePipe } from '../../../core/pipes/purchase-order-status-pipe-pipe';
import { Paginator } from '../../../partials/paginator/paginator';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-history',
  imports: [DatePipe, PurchaseOrderStatusPipePipe, Paginator, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  protected orders = signal<PaginatedResult<Order> | null>(null);
  pageNumber = 1;
  pageSize = 5;
  
  initOrder(){
    this.orderService.getOrders(this.pageSize, this.pageNumber).subscribe({
      next: response => {
        this.orders.set(response);  
      },
      error: (err) => {
        console.log(err);
        this.toastService.error('Valami hiba történt.')
      }
    })
  }
  
  ngOnInit(): void {
    this.initOrder();
  }

  onPageChangeKeys(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.initOrder();
  }
}
