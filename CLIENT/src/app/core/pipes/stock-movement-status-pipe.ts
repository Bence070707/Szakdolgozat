import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockMovementStatus',
})
export class StockMovementStatusPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 1:
        return "Függőben";
      case 2:
        return "Elfogadva";
      case 3:
        return "Elutasítva"
      default:
        return "Hibás";
    }
  }

}
