import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConfirmService } from '../../core/services/confirm-service';

@Component({
  selector: 'app-confirm',
  imports: [],
  templateUrl: './confirm.html',
  styleUrl: './confirm.css',
})
export class Confirm {
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  message = 'Biztosan befejezed a műveletet?'
  private resolver: ((value: boolean) => void) | null = null;

  constructor(){
    inject(ConfirmService).register(this);
  }

  open(message:string){
    this.message = message;
    this.dialogRef.nativeElement.showModal();
    return new Promise(resolve =>(this.resolver = resolve));
  }

  confirm(){
    this.dialogRef.nativeElement.close();
    this.resolver?.(true);
    this.resolver = null;
  }

  cancel(){
    this.dialogRef.nativeElement.close();
    this.resolver?.(false);
    this.resolver = null;
  }
}
