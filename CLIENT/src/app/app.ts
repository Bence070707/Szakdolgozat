import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from "./partials/header/header";
import { RouterOutlet } from "@angular/router";
import { Footer } from "./partials/footer/footer";
import { AccountService } from './core/services/account-service';
import { User } from '../types/User';

@Component({
  selector: 'app-root',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('CLIENT');
  private accountService = inject(AccountService);
  
  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser(){
    const user = localStorage.getItem('user');
    if(user){
      var userJson = JSON.parse(user);
      this.accountService.currentUser.set(userJson);
    }
  }
}
