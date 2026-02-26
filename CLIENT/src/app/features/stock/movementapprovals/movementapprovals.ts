import { Component, inject, OnInit, signal } from '@angular/core';
import { StockMovementService } from '../../../core/services/stock-movement-service';
import { PaginatedResult } from '../../../../types/Pagination';
import { StockMovement } from '../../../../types/StockMovement';
import { MovementItem } from './movement-item/movement-item';
import { Paginator } from "../../../partials/paginator/paginator";
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-movementapprovals',
  imports: [MovementItem, Paginator],
  templateUrl: './movementapprovals.html',
  styleUrl: './movementapprovals.css',
})
export class Movementapprovals implements OnInit {
  private stockMovementsService = inject(StockMovementService);
  private toastService = inject(ToastService);
  protected stockMovements = signal<PaginatedResult<StockMovement> | null>(null);
  pageNumber = 1;
  pageSize = 5

  ngOnInit(): void {
    this.initStockMovements();
  }

  initStockMovements() {
    this.stockMovementsService.getStockMovements(this.pageNumber, this.pageSize).subscribe({
      next: (result) => {
        this.stockMovements.set(result);
      },
      error: (error) => {
        console.error('Hiba történt a készletmozgások lekérése során:', error);
      }
    });
  }

  onPageChangeKeys(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.initStockMovements();
  }

  approve(movementId: string) {
    this.stockMovementsService.approve(movementId).subscribe({
      next: () => {
        this.toastService.success('Sikeresen elfogadta a készletmozgást!');
        this.initStockMovements();
      },
      error: err => {
        console.log('Hiba: ' + err);
        this.toastService.error('Hiba történt.');
      }
    })
  }

  disApprove(movementId: string) {
    this.stockMovementsService.disApprove(movementId).subscribe({
      next: () => {
        this.toastService.success('Sikeresen elutasította a készletmozgást!');
        this.initStockMovements();
      },
      error: err => {
        console.log('Hiba: ' + err);
        this.toastService.error('Hiba történt.');
      }
    })
  }
}
