import { Component, inject, signal } from '@angular/core';
import { KeysService } from '../../../core/services/keys-service';
import { Key } from '../../../../types/Key';
import { RouterLink } from "@angular/router";
import { PaginatedResult } from '../../../../types/Pagination';
import { Paginator } from '../../../partials/paginator/paginator';

@Component({
  selector: 'app-current',
  imports: [RouterLink, Paginator],
  templateUrl: './current.html',
  styleUrl: './current.css',
})
export class Current {
  private keysService = inject(KeysService);
  protected keys = signal<PaginatedResult<Key> | null>(null);
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.getKeys();
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

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.getKeys();
  }

}
