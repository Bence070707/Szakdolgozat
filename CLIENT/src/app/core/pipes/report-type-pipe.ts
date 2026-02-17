import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reportType',
})
export class ReportTypePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'daily':
        return 'Napi';
      case 'weekly':
        return 'Heti';
      case 'monthly':
        return 'Havi';
      case 'yearly':
        return 'Éves';
      case 'fromto':
        return 'Egyedi';
      default:
        return value;
    }
  }

}
