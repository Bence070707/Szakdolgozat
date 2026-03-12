import { Component, inject, OnInit, signal } from '@angular/core';
import { KeysService } from '../../../core/services/keys-service';
import { Key } from '../../../../types/Key';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  private toastService = inject(ToastService);
  protected accountService = inject(AccountService);
  private location = inject(Location);
  protected selectedImages = signal<File[]>([]);

  protected keyForm = this.fb.nonNullable.group({
    price: [0, Validators.required],
    priceType: [1, Validators.required],
    quantity: [0, Validators.required]
  });

  ngOnInit(): void {
    this.initKey();
  }

  initKey() {
    this.route.paramMap.subscribe(params => {
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
        });
      }
    });
  }

  async confirmDelete(publicId: string){
    const ok = await this.confirmService.confirm('Biztosan törlöd a képet?');
    if (ok) this.deleteImage(publicId);
  }

  async confirmArchiveKey() {
    const ok = await this.confirmService.confirm('Biztosan archivalsz?');
    if (ok) this.archiveKey();
  }

  async confirmUnArchiveKey() {
    const ok = await this.confirmService.confirm('Biztosan aktivalod?');
    if (ok) this.unArchiveKey();
  }

  async confirmSetMain(publicId: string, keyId: string){
    const ok = await this.confirmService.confirm('Biztosan főképként állítod be?');
    if(ok) this.setMainPhoto(publicId, keyId);
  }

  setMainPhoto(publicId: string, keyId: string){
    this.keysService.setMainPhoto(publicId, keyId).subscribe({
      next: () => {
        this.currentKey.update(key => {
          if (!key) return key;
          const updatedImages = key.images.map(img => ({
            ...img,
            isMain: img.publicId === publicId
          }));
          return { ...key, images: updatedImages };
        });
        this.toastService.success('Főképpé állítva.');
      },
      error: (err) => {
        console.error('Error setting main photo:', err);
        this.toastService.error('Valami hiba történt a főképpé állításkor.');
      }
    })
  }

  deleteImage(publicId: string){
      this.keysService.deleteImage(publicId).subscribe({
        next: () => {
          this.currentKey.update(key => {
            if (!key) return key;
            return { ...key, images: key.images.filter(img => img.publicId !== publicId) };
          });
          this.toastService.success('Kép sikeresen törölve.');
        },
        error: (err) => {
          console.error('Error deleting image:', err);
          this.toastService.error('Valami hiba történt a kép törlésekor.');
        }
      });
  }

  archiveKey() {
    if (this.currentKey()) {
      this.keysService.archiveKey(this.currentKey()?.id!).subscribe({
        next: () => {
          this.toastService.success('Kulcs sikeresen archvivalva.');
          this.currentKey.update(y => {
            if (!y) return y;
            return { ...y, isArchived: true };
          });
        }
      });
    }
  }

  unArchiveKey() {
    if (this.currentKey()) {
      this.keysService.unArchiveKey(this.currentKey()?.id!).subscribe({
        next: () => {
          this.toastService.success('Kulcs sikeresen aktivalva.');
          this.currentKey.update(y => {
            if (!y) return y;
            return { ...y, isArchived: false };
          });
        }
      });
    }
  }

  protected toggleEdit(value?: boolean) {
    const nextValue = value ?? !this.isEditMode();
    this.isEditMode.set(nextValue);

    if (this.currentKey()) {
      this.keyForm.patchValue(this.currentKey() as Key);
    }

    if (!nextValue) {
      this.selectedImages.set([]);
    }
  }

  async confirmUpdateKey(event: Event, id: string) {
    event.stopPropagation();
    const ok = await this.confirmService.confirm('Biztos frissited a keszletet?');
    if (ok) this.updateKey(id);
  }

  updateKey(id: string) {
    if (this.keyForm.valid && this.currentKey()) {
      const updatedKey = {
        ...this.currentKey(),
        ...this.keyForm.getRawValue()
      } as Key;

      this.keysService.updateKey(id, updatedKey, this.selectedImages()).subscribe({
        next: updated => {
          this.currentKey.set(updated);
          this.toggleEdit(false);
          this.keyForm.markAsUntouched();
          this.toastService.success('Sikeres adatfrissites.');
          this.stocksService.initApprovalCount();
        },
        error: (err) => {
          console.log(err);
          this.toastService.error('Valami hiba tortent.');
        }
      });
    }
  }

  goBack() {
    this.location.back();
  }

  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedImages.set(Array.from(input.files ?? []));
  }
}
