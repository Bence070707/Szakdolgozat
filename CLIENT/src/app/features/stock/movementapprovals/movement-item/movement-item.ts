import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { StockMovement } from '../../../../../types/StockMovement';
import { Key } from '../../../../../types/Key';
import { KeysService } from '../../../../core/services/keys-service';
import { StockMovementStatusPipe } from '../../../../core/pipes/stock-movement-status-pipe';
import { DatePipe } from '@angular/common';
import { ConfirmService } from '../../../../core/services/confirm-service';

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
  private confirmService = inject(ConfirmService);
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

  async confirmApprove(movementId: string) {
    const ok = await this.confirmService.confirm('Biztosan elfogadod a készletmozgást?');
    if (ok) this.approve(movementId);
  }

  async confirmDisApprove(movementId: string) {
    const ok = await this.confirmService.confirm('Biztosan elutasítod a készletmozgást?');
    if (ok) this.disApprove(movementId);
  }

  protected approve(movementId: string) {
    this.onApproval.emit(movementId);
  }

  protected disApprove(movementId: string) {
    this.onDisApproval.emit(movementId);
  }
}
