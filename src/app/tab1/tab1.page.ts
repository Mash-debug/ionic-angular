import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private authService: AuthService, private router: Router) {}
  authStateSubscription: Subscription | null = null;

  ionViewWillEnter() {
    this.authStateSubscription = this.authService.authState$.subscribe((aUser: User | null) => {
      if(!aUser) {
        this.router.navigate(["/login"]);
      }
    })
  }

  ionViewDidLeave(): void {
    this.authStateSubscription?.unsubscribe();
  }
}
