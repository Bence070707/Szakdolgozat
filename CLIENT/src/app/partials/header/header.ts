import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BusyService } from '../../core/services/busy-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected busyService = inject(BusyService);
}
