import { Component, signal } from '@angular/core';
import { Header } from "./partials/header/header";
import { RouterOutlet } from "@angular/router";
import { Footer } from "./partials/footer/footer";

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected readonly title = signal('CLIENT');
}
