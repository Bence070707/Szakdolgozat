import { Component, inject, OnInit, signal } from '@angular/core';
import { KeysService } from '../../../core/services/keys-service';
import { Key } from '../../../../types/Key';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-key-detailed',
  imports: [ReactiveFormsModule],
  templateUrl: './key-detailed.html',
  styleUrl: './key-detailed.css',
})
export class KeyDetailed implements OnInit {
  private keysService = inject(KeysService);
  protected currentKey = signal<Key | null>(null);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  protected isEditMode = signal(false);
  private toastService = inject(ToastService)
  private location = inject(Location);

  protected keyForm = this.fb.nonNullable.group({
    price: [0, Validators.required],
    priceType: [1, Validators.required],
    quantity: [0, Validators.required]
  })


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.keysService.getKeyById(id).subscribe({
      next: (key) => {
        this.currentKey.set(key);
        this.keyForm.patchValue(key);
      },
      error: (err) => {
        console.error('Error fetching key:', err);
      }
    })
  }

  protected toggleEdit(value?: boolean){
    this.isEditMode.update(x => value ?? !x);
    if(this.currentKey()) this.keyForm.patchValue(this.currentKey() as Key);
  }

  updateKey(id: string){
    if(this.keyForm.valid && this.currentKey()){
      const updatedKey = {
        ...this.currentKey(),
        ...this.keyForm.getRawValue()
      } as Key;
      
      
      this.keysService.updateKey(id, updatedKey).subscribe({
        next: response => {
          this.currentKey.set(response);
          this.toggleEdit(false);
          this.keyForm.markAsUntouched();
          this.toastService.success('Sikeres adatfrissítés.');
        },
        error: (err) => {
          console.log(err);
          this.toastService.error('Valami hiba történt.');
        }
      })
    }
  }

  goBack(){
    this.location.back();
  }
}
