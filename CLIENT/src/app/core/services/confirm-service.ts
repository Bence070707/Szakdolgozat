import { Injectable } from '@angular/core';
import { Confirm } from '../../partials/confirm/confirm';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  private dialog?: Confirm;

  register(component: Confirm) {
    this.dialog = component;
  }

  confirm(message: string) {
    if (!this.dialog) throw new Error('Hiba történt a dialógus megnyitásakor.')
    return this.dialog.open(message);
  }
}
