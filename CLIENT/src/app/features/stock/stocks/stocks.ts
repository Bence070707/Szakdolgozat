import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-stocks',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './stocks.html',
  styleUrl: './stocks.css',
})
export class Stocks{

}
