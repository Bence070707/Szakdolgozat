import { Component, computed, EventEmitter, inject, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { KeysService } from '../../../core/services/keys-service';
import { KeyOrder } from '../../../../types/KeyOrder';
import { Order, OrderItem } from '../../../../types/Order';
import { ToastService } from '../../../core/services/toast-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-order',
  imports: [],
  templateUrl: './new-order.html',
  styleUrl: './new-order.css',
})
export class NewOrder implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  protected order = signal<Order | null>(null);
  private keyService = inject(KeysService);
  protected keys = signal<KeyOrder[]>([]);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  @Output() tab = new EventEmitter<'drafts' | 'new'>();
  private router = inject(Router);
  protected isEdit = false;
  protected emailString = computed(() => {
    const items = this.keys()
      .filter(x => x.quantityToOrder > 0)
      .map(y => `${y.silcaCode || y.jmaCode || y.errebiCode}: ${y.quantityToOrder} db`)
      .join('\n')

    return `Tisztelt HobbyKey!
A következő kulcsok megrendelését kérném

${items || ''}

A szállítást a következő címre kérném: 3300, Eger, II. Rákóczi Ferenc utca 100. Tesco Hipermarket, Lottózó melletti Cipőkulcs üzlet
Üdvözlettel: 

Horváth László.`;
  });


  initOrder(id: string | null) {
    if (id) {
      this.isEdit = true;
      this.orderService.getOrder(id).subscribe({
        next: response => {
          this.order.set(response)
          this.initKeys();
        },
        error: err => {
          console.log(err);
        }
      })
    }
    else {

      this.orderService.getNewDraft().subscribe({
        next: response => {
          this.order.set(response);
          this.initKeys();
        },
        error: err => {
          console.log(err);
        }
      })
    }
  }

  initKeys() {
    this.keyService.getAllKeys().subscribe({
      next: response => {
        const order = this.order();

        const keyOrders: KeyOrder[] = response.map(key => {
          const existingItem = order?.items.find(i => i.id === key.id);

          return new KeyOrder(
            key.id,
            key.silcaCode,
            key.errebiCode,
            key.jmaCode,
            key.quantity,
            existingItem ? existingItem.quantity : 0
          );
        });

        this.keys.set(keyOrders);
      },
      error: err => console.error(err)
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      this.initOrder(id);
    });
  }

  ngOnDestroy(): void {
    const dto = this.getOrderForUpdate();
    this.orderService.draftsLoading.set(true);
    this.orderService.updateOrder(dto).subscribe({
      next: () => {
        this.toastService.success('Sikeresen mentve!');    
        this.orderService.loadDrafts();
      },
      error: () => {
        this.toastService.error('Valami hiba történt.')
      }
    });
  }

  private getOrderForUpdate(): Order {
    const order = this.order()
    if (!order) throw new Error("Nincs megrendelés!")

    return {
      ...order,
      supplierEmail: this.emailString(),
      items: this.keys().filter(x => x.quantityToOrder > 0).map(key => {
        return {
          id: key.id,
          quantity: key.quantityToOrder
        } as OrderItem
      })
    }
  }

  onIncrement(id: string) {
    this.keys.update(keys =>
      keys.map(k =>
        k.id === id
          ? { ...k, quantityToOrder: k.quantityToOrder + 1 }
          : k
      )
    );
  }


  onDecrement(id: string) {
    this.keys.update(keys =>
      keys.map(k =>
        k.id === id
          ? { ...k, quantityToOrder: Math.max(0, k.quantityToOrder - 1) }
          : k
      )
    );
  }


  onQuantityChange(item: KeyOrder, event: Event) {
    let value = Number((event.target as HTMLInputElement).value);

    if (value < 0) value = 0;

    this.keys.update(x => x.map(
      y => y === item ? { ...y, quantityToOrder: value } : y
    ))
  }

  onDelete(id: string) {
    this.keys.update(keys => keys.map(key => key.id === id ? { ...key, quantityToOrder: 0 } : key));
  }

  addQuantity(id: string, number: number) {
    const key = this.keys().find(x => x.id === id);
    if (!key) return;
    key.quantityToOrder += number;
    if (key.quantityToOrder < 0) key.quantityToOrder = 0;
    this.keys.update(keys => [...keys]);
  }

  subtractQuantity(id: string, amount: number) {
    this.keys.update(keys =>
      keys.map(k => {
        if (k.id !== id) return k;

        const newValue = Math.max(0, k.quantityToOrder - amount);

        return {
          ...k,
          quantityToOrder: newValue
        };
      })
    );
  }

  deleteDraft() {
    this.orderService.deleteOrder(this.order()!.id).subscribe({
      next: () => {
        this.toastService.success("Piszkozat sikeresen törölve.")
        this.router.navigateByUrl('/orders')
        this.tab.emit('drafts');
      },
      error: (err) => {
        console.log(err);   
        this.toastService.error("Hiba történt a törlés során.")
      }
    })
  }

  submitOrder() {
    const order = this.order();
    if (order) {
      order.supplierEmail = this.emailString();
      this.orderService.submitOrder(order).subscribe({
        next: () => {
          this.toastService.success('Rendelés sikeresen elküldve.')
          this.router.navigateByUrl('/orders')
          this.tab.emit('drafts');
        },
        error: err => {
          console.log(err);
          this.toastService.error('Valami hiba történt.')
        }
      })
    }
  }

  goBack(){
    this.location.back();
  }
}
