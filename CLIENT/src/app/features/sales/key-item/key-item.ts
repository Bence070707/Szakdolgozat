import { Component, EventEmitter, input, Output, output } from '@angular/core';
import { KeyToSellUI } from '../../../../types/SellableItem';

@Component({
  selector: 'app-key-item',
  imports: [],
  templateUrl: './key-item.html',
  styleUrl: './key-item.css',
})
export class KeyItem {
  item = input.required<KeyToSellUI>();
  @Output() add = new EventEmitter<KeyToSellUI>();

  onAdd(){
    this.add.emit(this.item());
  }
}
