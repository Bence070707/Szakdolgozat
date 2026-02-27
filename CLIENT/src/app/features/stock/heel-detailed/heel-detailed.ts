import { Component, inject, signal } from '@angular/core';
import { HeelsService } from '../../../core/services/heels-service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { Heel } from '../../../../types/Heel';
import { Location } from '@angular/common';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-heel-detailed',
  imports: [ReactiveFormsModule],
  templateUrl: './heel-detailed.html',
  styleUrl: './heel-detailed.css',
})
export class HeelDetailed {
  private heelsService = inject(HeelsService);
  protected currentHeel = signal<Heel | null>(null);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  protected isEditMode = signal(false);
  private toastService = inject(ToastService)
  protected accountService = inject(AccountService);
  private location = inject(Location);

  protected heelForm = this.fb.nonNullable.group({
    price: [0, Validators.required],
    quantity: [0, Validators.required]
  })


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
    })
  }

  archiveHeel() {
    if (this.currentHeel()) {
      this.heelsService.archiveHeel(this.currentHeel()?.id!).subscribe({
        next: () => {
          this.toastService.success("Sarok sikeresen archiválva.");
          this.currentHeel.update(y => {
            if (!y) return y;
            return { ...y, isArchived: true };
          })
        }
      })
    }
  }

  unArchiveHeel() {
    if (this.currentHeel()) {
      this.heelsService.unArchiveHeel(this.currentHeel()?.id!).subscribe({
        next: () => {
          this.toastService.success("Sarok sikeresen aktiválva.");
          this.currentHeel.update(y => {
            if (!y) return y;
            return { ...y, isArchived: false };
          })
        }
      })
    }
  }

  protected toggleEdit(value?: boolean) {
    this.isEditMode.update(x => value ?? !x);
    if (this.currentHeel()) this.heelForm.patchValue(this.currentHeel() as Heel);
  }

  updateHeel(id: string) {
    if (this.heelForm.valid && this.currentHeel()) {
      const updatedHeel = {
        ...this.currentHeel(),
        ...this.heelForm.getRawValue()
      } as Heel;


      this.heelsService.updateHeel(id, updatedHeel).subscribe({
        next: response => {
          this.currentHeel.set(response);
          this.toggleEdit(false);
          this.heelForm.markAsUntouched();
          this.toastService.success('Sikeres adatfrissítés.');
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
