import { Component, inject, signal } from '@angular/core';
import { KeysService } from '../../../core/services/keys-service';
import { Key } from '../../../../types/Key';
import { RouterLink } from "@angular/router";
import { PaginatedResult } from '../../../../types/Pagination';
import { Paginator } from '../../../partials/paginator/paginator';
import { Heel } from '../../../../types/Heel';
import { HeelsService } from '../../../core/services/heels-service';
import { BusyService } from '../../../core/services/busy-service';

@Component({
  selector: 'app-current',
  imports: [RouterLink, Paginator],
  templateUrl: './current.html',
  styleUrl: './current.css',
})
export class Current {
  private keysService = inject(KeysService);
  private heelsService = inject(HeelsService);
  protected busyService = inject(BusyService);
  protected keys = signal<PaginatedResult<Key> | null>(null);
  protected heels = signal<PaginatedResult<Heel> | null>(null);
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.getKeys();
    this.getHeels();
  }

  private getKeys() {
    this.keysService.getKeys(this.pageNumber, this.pageSize).subscribe({
      next: response => {
        this.keys.set(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  private getHeels() {
    this.heelsService.getHeels(this.pageNumber, this.pageSize).subscribe({
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

}
