import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string = "";
  password: string = "";
  errorMessage: string = "";
  authStateSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  async signIn() {

    if(this.isEmailNotNull() && this.isPasswordNotNull()) {
      const isSignedIn = await this.authService.signIn(this.email, this.password);
      if(!isSignedIn) {
        this.errorMessage = "Les identifiants sont incorrects."
      }
    } else {
      this.errorMessage = "Un ou plusieurs champs sont vides."
    }
  }

  private isEmailNotNull() {
    return this.email !== "";
  }

  private isPasswordNotNull() {
    return this.password !== "";
  }

  ionViewDidEnter() {
    this.authStateSubscription = this.authService.authState$.subscribe((aUser: User | null) => {
      if(aUser) {
        this.router.navigate(["/tabs/tab1"]);
      }
    })
  }

  ionViewDidLeave(): void {
    this.authStateSubscription?.unsubscribe();
  }
}
