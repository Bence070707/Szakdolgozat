import { Component, signal } from '@angular/core';
import { Drafts } from "./drafts/drafts";

@Component({
  selector: 'app-orders',
  imports: [Drafts],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  protected activeTab = signal<'drafts' | 'new' | 'history'>('drafts');
}
