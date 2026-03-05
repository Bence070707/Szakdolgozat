import { Component, inject, signal } from '@angular/core';
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
export class OtherDetailed {
  private othersService = inject(OthersService);
  private stocksService = inject(StockMovementService);
  private confirmService = inject(ConfirmService);
  protected currentOther = signal<Other | null>(null);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  protected isEditMode = signal(false);
  private toastService = inject(ToastService)
  protected accountService = inject(AccountService);
  private location = inject(Location);

  protected otherForm = this.fb.nonNullable.group({
    name: ["", Validators.required],
    price: [0, Validators.required],
    quantity: [0, Validators.required]
  })

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
    })
  }

  async confirmArchive(){
    const ok = await this.confirmService.confirm('Biztosan archiválod a terméket?');
    if(ok) this.archiveOther();
  }

  async confirmUnArchive(){
    const ok = await this.confirmService.confirm('Biztosan aktiválod a terméket?');
    if(ok) this.unArchiveOther();
  }

  archiveOther() {
    if (this.currentOther()) {
      this.othersService.archiveOther(this.currentOther()?.id!).subscribe({
        next: () => {
          this.toastService.success("Egyeb termek sikeresen archivalva.");
          this.currentOther.update(y => {
            if (!y) return y;
            return { ...y, isArchived: true };
          })
        }
      })
    }
  }

  unArchiveOther() {
    if (this.currentOther()) {
      this.othersService.unArchiveOther(this.currentOther()?.id!).subscribe({
        next: () => {
          this.toastService.success("Egyeb termek sikeresen aktivalva.");
          this.currentOther.update(y => {
            if (!y) return y;
            return { ...y, isArchived: false };
          })
        }
      })
    }
  }

  protected toggleEdit(value?: boolean) {
    this.isEditMode.update(x => value ?? !x);
    if (this.currentOther()) this.otherForm.patchValue(this.currentOther() as Other);
  }

  updateOther(id: string) {
    if (this.otherForm.valid && this.currentOther()) {
      const updatedOther = {
        ...this.currentOther(),
        ...this.otherForm.getRawValue()
      } as Other;

      this.othersService.updateOther(id, updatedOther).subscribe({
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
      })
    }
  }

  goBack() {
    this.location.back();
  }
}
