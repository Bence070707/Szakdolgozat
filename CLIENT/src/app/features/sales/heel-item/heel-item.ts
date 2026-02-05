import { Component, EventEmitter, input, Output } from '@angular/core';
import { HeelToSellUI } from '../../../../types/SellableItem';

@Component({
  selector: 'app-heel-item',
  imports: [],
  templateUrl: './heel-item.html',
  styleUrl: './heel-item.css',
})
export class HeelItem {
  item = input.required<HeelToSellUI>();
  @Output() add = new EventEmitter<HeelToSellUI>();

  onAdd(){
    this.add.emit(this.item());
  }
}
