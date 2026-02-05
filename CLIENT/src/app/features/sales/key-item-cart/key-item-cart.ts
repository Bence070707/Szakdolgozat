import { Component, EventEmitter, input, Output } from '@angular/core';
import { KeyToSellUI } from '../../../../types/SellableItem';

@Component({
  selector: 'app-key-item-cart',
  imports: [],
  templateUrl: './key-item-cart.html',
  styleUrl: './key-item-cart.css',
})
export class KeyItemCart {
  item = input.required<KeyToSellUI>();
  @Output() increment = new EventEmitter<KeyToSellUI>();
  @Output() decrement = new EventEmitter<KeyToSellUI>();
  @Output() delete = new EventEmitter<KeyToSellUI>();
  
  onIncrement() {
    this.increment.emit(this.item());
  }

  onDecrement(){
    this.decrement.emit(this.item());
  }

  onDelete(){
    this.delete.emit(this.item());
    
  }
}
