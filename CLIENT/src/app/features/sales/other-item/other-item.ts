import { Component, EventEmitter, input, Output } from '@angular/core';
import { OtherToSellUI } from '../../../../types/SellableItem';

@Component({
  selector: 'app-other-item',
  imports: [],
  templateUrl: './other-item.html',
  styleUrl: './other-item.css',
})
export class OtherItem {
  item = input.required<OtherToSellUI>();
  @Output() add = new EventEmitter<OtherToSellUI>();

  onAdd() {
    this.add.emit(this.item());
  }
}
