import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from "./partials/header/header";
import { RouterOutlet } from "@angular/router";
import { Footer } from "./partials/footer/footer";
import { AccountService } from './core/services/account-service';
import { User } from '../types/User';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App{
  protected readonly title = signal('CLIENT');
}
