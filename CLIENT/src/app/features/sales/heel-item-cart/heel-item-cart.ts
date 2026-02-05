import { Component, EventEmitter, input, Output } from '@angular/core';
import { HeelToSellUI } from '../../../../types/SellableItem';

@Component({
  selector: 'app-heel-item-cart',
  imports: [],
  templateUrl: './heel-item-cart.html',
  styleUrl: './heel-item-cart.css',
})
export class HeelItemCart {
  item = input.required<HeelToSellUI>();
  @Output() delete = new EventEmitter<HeelToSellUI>();
  @Output() add = new EventEmitter<HeelToSellUI>();
  @Output() decrement = new EventEmitter<HeelToSellUI>();

  onDelete() {
    this.delete.emit(this.item());
  }

  onIncrement() {
    this.add.emit(this.item());
  }

  onDecrement() {
    this.decrement.emit(this.item());
  }
}
