import { Component, inject, OnInit, signal } from '@angular/core';
import { OthersService } from '../../../core/services/others-service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { Other } from '../../../../types/Other';
import { Location } from '@angular/common';
import { AccountService } from '../../../core/services/account-service';
import { StockMovementService } from '../../../core/services/stock-movement-service';
import { ConfirmService } from '../../../core/services/confirm-service';

@Component({
  selector: 'app-other-detailed',
  imports: [ReactiveFormsModule],
  templateUrl: './other-detailed.html',
  styleUrl: './other-detailed.css',
})
export class OtherDetailed implements OnInit {
  private othersService = inject(OthersService);
  private stocksService = inject(StockMovementService);
  private confirmService = inject(ConfirmService);
  protected currentOther = signal<Other | null>(null);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  protected isEditMode = signal(false);
  private toastService = inject(ToastService);
  protected accountService = inject(AccountService);
  private location = inject(Location);
  protected selectedImages = signal<File[]>([]);

  protected otherForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    price: [0, Validators.required],
    quantity: [0, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.othersService.getOtherById(id).subscribe({
      next: (other) => {
        this.currentOther.set(other);
        this.otherForm.patchValue(other);
      },
      error: (err) => {
        console.error('Error fetching other item:', err);
      }
    });
  }

  async confirmDelete(publicId: string) {
    const ok = await this.confirmService.confirm('Biztosan torlod a kepet?');
    if (ok) this.deleteImage(publicId);
  }

  async confirmArchive() {
    const ok = await this.confirmService.confirm('Biztosan archivalod a termeket?');
    if (ok) this.archiveOther();
  }

  async confirmUnArchive() {
    const ok = await this.confirmService.confirm('Biztosan aktivalod a termeket?');
    if (ok) this.unArchiveOther();
  }

  async confirmSetMain(publicId: string, otherId: string) {
    const ok = await this.confirmService.confirm('Biztosan fokepkent allitod be?');
    if (ok) this.setMainPhoto(publicId, otherId);
  }

  setMainPhoto(publicId: string, otherId: string) {
    this.othersService.setMainPhoto(publicId, otherId).subscribe({
      next: () => {
        this.currentOther.update(other => {
          if (!other) return other;
          const updatedImages = other.images.map(img => ({
            ...img,
            isMain: img.publicId === publicId
          }));
          return { ...other, images: updatedImages };
        });
        this.toastService.success('Fokeppe allitva.');
      },
      error: (err) => {
        console.error('Error setting main photo:', err);
        this.toastService.error('Valami hiba tortent a fokep beallitasakor.');
      }
    });
  }

  deleteImage(publicId: string) {
    this.othersService.deleteImage(publicId).subscribe({
      next: () => {
        this.currentOther.update(other => {
          if (!other) return other;
          return { ...other, images: other.images.filter(img => img.publicId !== publicId) };
        });
        this.toastService.success('Kep sikeresen torolve.');
      },
      error: (err) => {
        console.error('Error deleting image:', err);
        this.toastService.error('Valami hiba tortent a kep torlesekor.');
      }
    });
  }

  archiveOther() {
    if (this.currentOther()) {
      this.othersService.archiveOther(this.currentOther()?.id!).subscribe({
        next: () => {
          this.toastService.success('Egyeb termek sikeresen archivalva.');
          this.currentOther.update(y => {
            if (!y) return y;
            return { ...y, isArchived: true };
          });
        }
      });
    }
  }

  unArchiveOther() {
    if (this.currentOther()) {
      this.othersService.unArchiveOther(this.currentOther()?.id!).subscribe({
        next: () => {
          this.toastService.success('Egyeb termek sikeresen aktivalva.');
          this.currentOther.update(y => {
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

    if (this.currentOther()) {
      this.otherForm.patchValue(this.currentOther() as Other);
    }

    if (!nextValue) {
      this.selectedImages.set([]);
    }
  }

  async confirmSubmit(event: Event, id: string) {
    event.stopPropagation();
    const ok = await this.confirmService.confirm('Biztosan frissited a keszletet?');
    if (ok) this.updateOther(id);
  }

  updateOther(id: string) {
    if (this.otherForm.valid && this.currentOther()) {
      const updatedOther = {
        ...this.currentOther(),
        ...this.otherForm.getRawValue()
      } as Other;

      this.othersService.updateOther(id, updatedOther, this.selectedImages()).subscribe({
        next: response => {
          this.currentOther.set(response);
          this.toggleEdit(false);
          this.otherForm.markAsUntouched();
          this.stocksService.initApprovalCount();
          this.toastService.success('Sikeres adatfrissites.');
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
