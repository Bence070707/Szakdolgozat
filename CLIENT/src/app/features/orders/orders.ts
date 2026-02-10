import { Component, signal } from '@angular/core';
import { Drafts } from "./drafts/drafts";
import { NewOrder } from './new-order/new-order';

@Component({
  selector: 'app-orders',
  imports: [Drafts, NewOrder],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  protected activeTab = signal<'drafts' | 'new' | 'history'>('drafts');

  changeTab(tab: 'drafts' | 'new' | 'history'){
    this.activeTab.set(tab);
  }
}
