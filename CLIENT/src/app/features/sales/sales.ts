import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Heel } from '../../../types/Heel';
import { KeysService } from '../../core/services/keys-service';
import { HeelsService } from '../../core/services/heels-service';
import { HeelToSellUI, KeyToSellUI, SellableItemUI } from '../../../types/SellableItem';
import { KeyItem } from './key-item/key-item';
import { HeelItem } from './heel-item/heel-item';
import { HeelItemCart } from "./heel-item-cart/heel-item-cart";
import { KeyItemCart } from "./key-item-cart/key-item-cart";
import { SalesService } from '../../core/services/sales-service';
import { CreateSaleDTO } from '../../../types/CreateSaleItemDTO';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'app-sales',
  imports: [KeyItem, HeelItem, HeelItemCart, KeyItemCart],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
})
export class Sales implements OnInit {
  private keysService = inject(KeysService);
  private heelsService = inject(HeelsService);
  private salesService = inject(SalesService);
  private toastService = inject(ToastService);
  protected sales = signal<SellableItemUI[]>([]);
  protected items = signal<SellableItemUI[]>([]);
  protected searchTerm = signal<string>('');
  filteredItems = computed(() => {
    const value = this.searchTerm().trim().toLowerCase();

    if (!value) return this.items();

    return this.items().filter(item => {
      if (this.isKey(item)) {
        return item.silcaCode.toLowerCase().includes(value) ||
          item.errebiCode?.toLowerCase().includes(value) ||
          item.jmaCode?.toLowerCase().includes(value);
      } 
      if(this.isHeel(item)){
        return item.code.toLowerCase().includes(value);
      }
      return item;
    });
  });

  ngOnInit(): void {
    this.initHeels();
    this.initKeys();
  }

  createSale() {
    if (this.sales().length > 0) {
      const saleDTO = new CreateSaleDTO(this.sales());
      this.salesService.createSale(saleDTO).subscribe({
        next: () => {
          this.sales.set([]);
          this.items.set([]);
          this.toastService.success('Sikeres eladás.');
          this.initHeels();
          this.initKeys();
        },
        error: (err) => {
          console.log(err);
          this.toastService.warning('Valami hiba történt.');

        }
      })
    }
  }

  private initKeys() {
    this.keysService.getAllKeys().subscribe({
      next: response => {
        const mapped = response
          .filter(x => x.quantity > 0)
          .map(key => new KeyToSellUI(key));
        this.items.update(items => {
          return [
            ...items,
            ...mapped
          ]
        })
      },
      error: err => {
        console.log(err);
      }
    })
  }

  private initHeels() {
    this.heelsService.getAllHeels().subscribe({
      next: response => {
        const mapped = response
          .filter(x => x.quantity > 0)
          .map(heel => new HeelToSellUI(heel));

        this.items.update(items => {
          return [
            ...items,
            ...mapped
          ]
        })

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
        return sales.map(x => {
          if (x === existing) {
            const quantity = this.items().find(x => x.productId === item.productId && x.type === item.type)?.quantity || 0;
            if (x.quantity + 1 > quantity) {
              this.toastService.error('Nincs több termék készleten.');
              return x;
            }

            return {
              ...x,
              quantity: x.quantity + 1
            };
          }

          return x;
        });
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
    this.toastService.info('Termék eltávolítva az eladásokból.');
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
        this.toastService.info('Termék eltávolítva az eladásokból.');
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
