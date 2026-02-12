import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../../../types/Order';
import { OrderService } from '../../../core/services/order-service';

@Component({
  selector: 'app-edit-draft',
  imports: [],
  templateUrl: './edit-draft.html',
  styleUrl: './edit-draft.css',
})
export class EditDraft implements OnInit {
  private route = inject(ActivatedRoute);
  protected draft = signal<Order | null>(null);
  private orderService = inject(OrderService);

  ngOnInit(): void {
    this.initDraft();
  }

  initDraft() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.orderService.getOrder(id).subscribe({
        next: response => {
          this.draft.set(response);
        },
        error: err => {
          console.log(err);
        }
      });

    }
  }
}
