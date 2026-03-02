import { Component, inject, signal } from '@angular/core';
import { KeysService } from '../../../core/services/keys-service';
import { Key } from '../../../../types/Key';
import { Router, RouterLink } from "@angular/router";
import { PaginatedResult } from '../../../../types/Pagination';
import { Paginator } from '../../../partials/paginator/paginator';
import { Heel } from '../../../../types/Heel';
import { HeelsService } from '../../../core/services/heels-service';
import { BusyService } from '../../../core/services/busy-service';
import { AccountService } from '../../../core/services/account-service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { CreateKeyDto } from '../../../../types/CreateKeyDto';
import { ToastService } from '../../../core/services/toast-service';
import { CreateHeelDto } from '../../../../types/CreateHeelDto';
import { StockMovementService } from '../../../core/services/stock-movement-service';

@Component({
  selector: 'app-current',
  imports: [RouterLink, Paginator, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './current.html',
  styleUrl: './current.css',
})
export class Current {
  submitKeyAdd() {
    if (this.keyAddForm.invalid) return;
    this.createKey();
  }

  submitHeelAdd() {
    if (this.heelAddForm.invalid) return;
    this.createHeel();
  }
  private stocksService = inject(StockMovementService);
  private keysService = inject(KeysService);
  private heelsService = inject(HeelsService);
  protected busyService = inject(BusyService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  protected keys = signal<PaginatedResult<Key> | null>(null);
  protected heels = signal<PaginatedResult<Heel> | null>(null);
  protected includeArchived = signal(false);
  protected includeArchivedHeels = signal(false);
  protected isKeyAdding = signal(false);
  protected isHeelAdding = signal(false);
  pageNumber = 1;
  pageSize = 5;
  searchKey = '';
  searchHeel = '';

  protected keyAddForm = this.fb.nonNullable.group({
    silcaCode: ["", [Validators.required, Validators.minLength(3)]],
    errebiCode: [""],
    jmaCode: [""],
    price: [0, [Validators.required, Validators.min(1)]],
    quantity: [0, [Validators.min(0)]],
  });

  protected heelAddForm = this.fb.nonNullable.group({
    name: ["", [Validators.required, Validators.minLength(1)]],
    size: [0, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(1)]],
    quantity: [0, [Validators.min(0)]],
  });

  ngOnInit(): void {
    this.getKeys();
    this.getHeels();
  }

  onIncludeArchivedChanged(event: Event) {
    this.includeArchived.set((event.target as HTMLInputElement).checked);
    this.getKeys();
  }

  onIncludeArchivedHeelsChanged(event: Event) {
    this.includeArchivedHeels.set((event.target as HTMLInputElement).checked);
    this.getHeels();
  }

  toggleKeyAdding() {
    this.keyAddForm.reset();
    this.isKeyAdding.set(!this.isKeyAdding());
  }

  toggleHeelAdding() {
    this.heelAddForm.reset();
    this.isHeelAdding.set(!this.isHeelAdding());
  }

  private getKeys() {
    this.keysService.getKeys(this.pageNumber, this.pageSize, this.searchKey, this.includeArchived()).subscribe({
      next: response => {
        this.keys.set(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  private getHeels() {
    this.heelsService.getHeels(this.pageNumber, this.pageSize, this.searchHeel, this.includeArchivedHeels()).subscribe({
      next: response => {
        this.heels.set(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  onPageChangeKeys(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.getKeys();
  }

  onPageChangeHeels(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.getHeels();
  }

  onSearchKeyChange(event: string) {
    this.searchKey = event;
    this.getKeys();
  }

  onSearchHeelChange(event: string) {
    this.searchHeel = event;
    this.getHeels();
  }

  createKey(){
    this.keysService.createKey(this.keyAddForm.value as CreateKeyDto).subscribe({
      next: response =>{
        this.router.navigateByUrl("stocks/keys/" + response.keyId);
        this.toastService.success("Kulcs sikeresen hozzáadva");
      },
      error: err => {
        console.log(err);
        this.toastService.error("Hiba történt a kulcs hozzáadása során.");
      }
    })
  }

  createHeel(){
    const heelValues = this.heelAddForm.getRawValue();

    const payload: CreateHeelDto = {
      code: `${heelValues.name.trim()}-${heelValues.size}`,
      price: heelValues.price,
      quantity: heelValues.quantity
    };

    this.heelsService.createHeel(payload).subscribe({
      next: response => {
        this.router.navigateByUrl("stocks/heels/" + response.heelId);
        this.toastService.success("Sarok sikeresen hozzáadva");
      },
      error: err => {
        console.log(err);
        this.toastService.error("Hiba történt a sarok hozzáadása során.");
      }
    })
  }
}
