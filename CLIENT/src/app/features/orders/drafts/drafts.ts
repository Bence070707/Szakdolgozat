import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../../types/Order';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-drafts',
  imports: [RouterLink, DatePipe],
  templateUrl: './drafts.html',
  styleUrl: './drafts.css',
})
export class Drafts implements OnInit{
  private orderService = inject(OrderService);
  protected drafts = signal<Order[] | null>(null);
  
  ngOnInit(): void {
    this.getDrafts();
  }
  
  getDrafts(){
    this.orderService.getDrafts().subscribe({
      next: response => {
        this.drafts.set(response);
      },
      error: err =>{
        console.log(err);      
      }
    })
  }
}
