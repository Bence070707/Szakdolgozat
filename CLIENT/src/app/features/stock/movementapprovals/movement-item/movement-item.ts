import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { StockMovement } from '../../../../../types/StockMovement';
import { Key } from '../../../../../types/Key';
import { KeysService } from '../../../../core/services/keys-service';
import { StockMovementStatusPipe } from '../../../../core/pipes/stock-movement-status-pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movement-item',
  imports: [StockMovementStatusPipe, DatePipe],
  templateUrl: './movement-item.html',
  styleUrl: './movement-item.css',
})
export class MovementItem implements OnInit {
  movementItem = input.required<StockMovement>();
  protected productAsKey = signal<Key | null>(null);
  private keysService = inject(KeysService);
  onApproval = output<string>();
  onDisApproval = output<string>();
  ngOnInit(): void {
    this.initKey();
  }

  private initKey() {
    this.keysService.getKeyById(this.movementItem().productId).subscribe({
      next: response => {
        this.productAsKey.set(response);
      }
    })
  }

  protected approve(movementId: string){
    this.onApproval.emit(movementId);
  }

  protected disApprove(movementId: string){
    this.onDisApproval.emit(movementId);
  }
}
