import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../../types/Order';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';
import { SummarisedOrderItem } from '../../../../types/SummarisedOrderItem';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sent-confirmation',
  imports: [FormsModule],
  templateUrl: './sent-confirmation.html',
  styleUrl: './sent-confirmation.css',
})
export class SentConfirmation implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  protected order = signal<Order | null>(null);
  protected orderItems = signal<SummarisedOrderItem[]>([]);

  ngOnInit(): void {
    this.initOrder();
    this.initItems();
  }

  private initOrder() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrder(id).subscribe({
        next: response => {
          this.order.set(response);
        },
        error: err => {
          this.toastService.error('Valami hiba történt.');
        }
      })
    }
  }

  private initItems() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getSummarisedOrderItems(id).subscribe({
        next: response => {
          this.orderItems.update(items =>
            response.map(x => ({
              ...x,
              enteredQuantity: x.quantity
            }))
          );
        },
        error: err => {
          this.toastService.error('Valami hiba történt.');
        }
      })
    }
  }

  receiveOrder() {
    let order = this.order();
    if(!order) return;
    order.items.forEach(item => {
      let enteredQuantity = this.orderItems().find(x => x.id === item.id)?.enteredQuantity;
      if (enteredQuantity !== undefined) {
        item.quantity = enteredQuantity;
      }
    });

    if (this.order()) {
      this.orderService.receiveOrder(order).subscribe({
        next: response => {
          this.toastService.success('Rendelés sikeresen elfogadva.');
        },
        error: err => {
          this.toastService.error('Valami hiba történt.');
        }
      })
    }
  }

  goBack(){
    this.location.back();
  }
}
