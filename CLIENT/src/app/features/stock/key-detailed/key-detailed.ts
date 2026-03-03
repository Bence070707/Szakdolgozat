import { Component, inject, OnInit, signal } from '@angular/core';
import { KeysService } from '../../../core/services/keys-service';
import { Key } from '../../../../types/Key';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { Location } from '@angular/common';
import { AccountService } from '../../../core/services/account-service';
import { StockMovementService } from '../../../core/services/stock-movement-service';
import { ConfirmService } from '../../../core/services/confirm-service';

@Component({
  selector: 'app-key-detailed',
  imports: [ReactiveFormsModule],
  templateUrl: './key-detailed.html',
  styleUrl: './key-detailed.css',
})
export class KeyDetailed implements OnInit {
  private keysService = inject(KeysService);
  private confirmService = inject(ConfirmService);
  private stocksService = inject(StockMovementService);
  protected currentKey = signal<Key | null>(null);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  protected isEditMode = signal(false);
  private toastService = inject(ToastService)
  protected accountService = inject(AccountService);
  private location = inject(Location);

  protected keyForm = this.fb.nonNullable.group({
    price: [0, Validators.required],
    priceType: [1, Validators.required],
    quantity: [0, Validators.required]
  })


  ngOnInit(): void {
    this.initKey();

  }

  initKey() {
    const id = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.keysService.getKeyById(id).subscribe({
          next: (key) => {
            this.currentKey.set(key);
            this.keyForm.patchValue(key);
          },
          error: (err) => {
            console.error('Error fetching key:', err);
          }
        })
      };
    })
  }

  async confirmArchiveKey() {
    const ok = await this.confirmService.confirm('Biztosan archiválod?');
    if (ok) this.archiveKey();
  }

  async confirmUnArchiveKey() {
    const ok = await this.confirmService.confirm('Biztosan aktiválod?');
    if (ok) this.unArchiveKey();
  }

  archiveKey() {
    if (this.currentKey()) {
      this.keysService.archiveKey(this.currentKey()?.id!).subscribe({
        next: () => {
          this.toastService.success("Kulcs sikeresen archiválva.");
          this.currentKey.update(y => {
            if (!y) return y;
            return { ...y, isArchived: true };
          })
        }
      })
    }
  }

  unArchiveKey() {
    if (this.currentKey()) {
      this.keysService.unArchiveKey(this.currentKey()?.id!).subscribe({
        next: () => {
          this.toastService.success("Kulcs sikeresen aktiválva.");
          this.currentKey.update(y => {
            if (!y) return y;
            return { ...y, isArchived: false };
          })
        }
      })
    }
  }

  protected toggleEdit(value?: boolean) {
    this.isEditMode.update(x => value ?? !x);
    if (this.currentKey()) this.keyForm.patchValue(this.currentKey() as Key);
  }

  async confirmUpdateKey(event: Event, id: string){
    event.stopPropagation();
    const ok = await this.confirmService.confirm("Biztos frissíted a készletet?");
    if(ok) this.updateKey(id);
  }

  updateKey(id: string) {
    if (this.keyForm.valid && this.currentKey()) {
      const updatedKey = {
        ...this.currentKey(),
        ...this.keyForm.getRawValue()
      } as Key;


      this.keysService.updateKey(id, updatedKey).subscribe({
        next: response => {
          this.initKey();
          this.toggleEdit(false);
          this.keyForm.markAsUntouched();
          this.toastService.success('Sikeres adatfrissítés.');
          this.stocksService.initApprovalCount();
        },
        error: (err) => {
          console.log(err);
          this.toastService.error('Valami hiba történt.');
        }
      })
    }
  }

  goBack() {
    this.location.back();
  }
}
