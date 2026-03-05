import { Component, EventEmitter, input, Output } from '@angular/core';
import { OtherToSellUI } from '../../../../types/SellableItem';

@Component({
  selector: 'app-other-item-cart',
  imports: [],
  templateUrl: './other-item-cart.html',
  styleUrl: './other-item-cart.css',
})
export class OtherItemCart {
  item = input.required<OtherToSellUI>();
  @Output() delete = new EventEmitter<OtherToSellUI>();
  @Output() add = new EventEmitter<OtherToSellUI>();
  @Output() decrement = new EventEmitter<OtherToSellUI>();

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
