import { Component, signal } from '@angular/core';
import { Drafts } from "./drafts/drafts";
import { NewOrder } from './new-order/new-order';
import { History } from './history/history';

@Component({
  selector: 'app-orders',
  imports: [Drafts, NewOrder, History],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  protected activeTab = signal<'drafts' | 'new' | 'history'>('drafts');

  changeTab(tab: 'drafts' | 'new' | 'history'){
    this.activeTab.set(tab);
  }
}
