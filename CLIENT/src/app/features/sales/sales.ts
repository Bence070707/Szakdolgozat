import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Key } from '../../../types/Key';
import { Heel } from '../../../types/Heel';
import { KeysService } from '../../core/services/keys-service';
import { HeelsService } from '../../core/services/heels-service';
import { HeelToSellUI, KeyToSellUI, SellableItemUI } from '../../../types/SellableItem';
import { KeyItem } from './key-item/key-item';
import { HeelItem } from './heel-item/heel-item';
import { HeelItemCart } from "./heel-item-cart/heel-item-cart";
import { KeyItemCart } from "./key-item-cart/key-item-cart";

@Component({
  selector: 'app-sales',
  imports: [KeyItem, HeelItem, HeelItemCart, KeyItemCart],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
})
export class Sales implements OnInit {
  private http = inject(HttpClient);
  protected heels = signal<Heel[]>([]);
  private keysService = inject(KeysService);
  private heelsService = inject(HeelsService);
  protected sales = signal<SellableItemUI[]>([]);
  protected items = signal<SellableItemUI[]>([]);

  ngOnInit(): void {
    this.initHeels();
    this.initKeys();
  }

  private initKeys() {
    this.keysService.getAllKeys().subscribe({
      next: response => {
        const mapped = response.map(key => new KeyToSellUI(key));

        this.items.update(items => {
          return [
            ...items,
            ...mapped
          ]
        })
        console.log(this.items);

      },
      error: err => {
        console.log(err);
      }
    })
  }

  private initHeels() {
    this.heelsService.getAllHeels().subscribe({
      next: response => {
        const mapped = response.map(heel => new HeelToSellUI(heel));

        this.items.update(items => {
          return [
            ...items,
            ...mapped
          ]
        })
        console.log(this.items);

      },
      error: err => {
        console.log(err);
      }
    })
  }

  addToSales(item: SellableItemUI) {
    this.sales.update(sales => {
      const existing = sales.find(
        s => s.productId === item.productId && s.type === item.type
      );

      if (existing) {
        return sales.map(s =>
          s === existing
            ? { ...s, quantity: s.quantity + 1 }
            : s
        );
      }

      return [
        ...sales,
        { ...item, quantity: 1 }
      ];
    });
  }

  deleteFromSales(item: SellableItemUI) {
    this.sales.update(sales =>
      sales.filter(s =>
        !(s.productId === item.productId && s.type === item.type)
      )
    )
  }

  decrement(item: SellableItemUI) {
    this.sales.update(sales => {
      const existing = sales.find(
        s => s.productId === item.productId && s.type === item.type
      );

      if (!existing) {
        return sales;
      }

      if (existing.quantity === 1) {
        return sales.filter(
          s => !(s.productId === item.productId && s.type === item.type)
        );
      }

      return sales.map(s =>
        s === existing
          ? { ...s, quantity: s.quantity - 1 }
          : s
      );
    });
  }

  isKey(item: SellableItemUI): item is KeyToSellUI {
    return item.type === 'KEY';
  }

  isHeel(item: SellableItemUI): item is HeelToSellUI {
    return item.type === 'HEEL'
  }
}
