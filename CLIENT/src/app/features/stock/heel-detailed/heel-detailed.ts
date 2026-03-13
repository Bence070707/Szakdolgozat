import { Component, inject, OnInit, signal } from '@angular/core';
import { HeelsService } from '../../../core/services/heels-service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { Heel } from '../../../../types/Heel';
import { Location } from '@angular/common';
import { AccountService } from '../../../core/services/account-service';
import { StockMovementService } from '../../../core/services/stock-movement-service';
import { ConfirmService } from '../../../core/services/confirm-service';

@Component({
  selector: 'app-heel-detailed',
  imports: [ReactiveFormsModule],
  templateUrl: './heel-detailed.html',
  styleUrl: './heel-detailed.css',
})
export class HeelDetailed implements OnInit {
  private heelsService = inject(HeelsService);
  private stocksService = inject(StockMovementService);
  private confirmService = inject(ConfirmService);
  protected currentHeel = signal<Heel | null>(null);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  protected isEditMode = signal(false);
  private toastService = inject(ToastService);
  protected accountService = inject(AccountService);
  private location = inject(Location);
  protected selectedImages = signal<File[]>([]);

  protected heelForm = this.fb.nonNullable.group({
    price: [0, Validators.required],
    quantity: [0, Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.heelsService.getHeelById(id).subscribe({
      next: (heel) => {
        this.currentHeel.set(heel);
        this.heelForm.patchValue(heel);
      },
      error: (err) => {
        console.error('Error fetching heel:', err);
      }
    });
  }

  async confirmDelete(publicId: string) {
    const ok = await this.confirmService.confirm('Biztosan torlod a kepet?');
    if (ok) this.deleteImage(publicId);
  }

  async confirmArchiveHeel() {
    const ok = await this.confirmService.confirm('Biztos archivalod a sarkat?');
    if (ok) this.archiveHeel();
  }

  async confirmUnArchiveHeel() {
    const ok = await this.confirmService.confirm('Biztos aktivalod a sarkat?');
    if (ok) this.unArchiveHeel();
  }

  async confirmSetMain(publicId: string, heelId: string) {
    const ok = await this.confirmService.confirm('Biztosan fokepkent allitod be?');
    if (ok) this.setMainPhoto(publicId, heelId);
  }

  setMainPhoto(publicId: string, heelId: string) {
    this.heelsService.setMainPhoto(publicId, heelId).subscribe({
      next: () => {
        this.currentHeel.update(heel => {
          if (!heel) return heel;
          const updatedImages = heel.images.map(img => ({
            ...img,
            isMain: img.publicId === publicId
          }));
          return { ...heel, images: updatedImages };
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
    this.heelsService.deleteImage(publicId).subscribe({
      next: () => {
        this.currentHeel.update(heel => {
          if (!heel) return heel;
          return { ...heel, images: heel.images.filter(img => img.publicId !== publicId) };
        });
        this.toastService.success('Kep sikeresen torolve.');
      },
      error: (err) => {
        console.error('Error deleting image:', err);
        this.toastService.error('Valami hiba tortent a kep torlesekor.');
      }
    });
  }

  archiveHeel() {
    if (this.currentHeel()) {
      this.heelsService.archiveHeel(this.currentHeel()?.id!).subscribe({
        next: () => {
          this.toastService.success('Sarok sikeresen archivalva.');
          this.currentHeel.update(y => {
            if (!y) return y;
            return { ...y, isArchived: true };
          });
        }
      });
    }
  }

  unArchiveHeel() {
    if (this.currentHeel()) {
      this.heelsService.unArchiveHeel(this.currentHeel()?.id!).subscribe({
        next: () => {
          this.toastService.success('Sarok sikeresen aktivalva.');
          this.currentHeel.update(y => {
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

    if (this.currentHeel()) {
      this.heelForm.patchValue(this.currentHeel() as Heel);
    }

    if (!nextValue) {
      this.selectedImages.set([]);
    }
  }

  async confirmSubmit(event: Event, id: string) {
    event.stopPropagation();
    const ok = await this.confirmService.confirm('Biztosan frissited a keszletet?');
    if (ok) this.updateHeel(id);
  }

  updateHeel(id: string) {
    if (this.heelForm.valid && this.currentHeel()) {
      const updatedHeel = {
        ...this.currentHeel(),
        ...this.heelForm.getRawValue()
      } as Heel;

      this.heelsService.updateHeel(id, updatedHeel, this.selectedImages()).subscribe({
        next: response => {
          this.currentHeel.set(response);
          this.toggleEdit(false);
          this.heelForm.markAsUntouched();
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
