import { Pipe, PipeTransform } from '@angular/core';
import { PurchaseOrderStatus } from '../../../types/Order';

@Pipe({
  name: 'purchaseOrderStatusPipe',
})
export class PurchaseOrderStatusPipePipe implements PipeTransform {

  transform(value: PurchaseOrderStatus): string {
    switch(value){
      case PurchaseOrderStatus.DRAFT:
        return 'Piszkozat';
      case PurchaseOrderStatus.SEND:
        return 'Elküldve';
      case PurchaseOrderStatus.CANCELLED:
        return 'Törölve';
      case PurchaseOrderStatus.RECEIVED:
        return 'Bevételezeve';
      default: return ''
    }
  }

}
