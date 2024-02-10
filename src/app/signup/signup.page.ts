import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {

  email: string = "";
  username: string = "";
  password: string = "";
  confirmPassword: string = "";
  errorMessage: string = "";
  authStateSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  async signUpHandler(): Promise<void> {
    if(!this.isEmailValid()) {
      this.errorMessage = "L'email n'est pas valide";
      return;
    } else if(!this.isUsernameValid()) {
      this.errorMessage = "Le pseudo n'est pas valide";
      return;
    } else if(!this.isPasswordValid()) {
      this.errorMessage = "Le mot de passe doit comporter minimum 8 caractères et un nombre.";
      return;
    } else if(!this.doPasswordsMatch()) {
      this.errorMessage = "Les deux mots de passe ne correspondent pas";
    } else {
      const isSignedUp = await this.authService.signUp(this.email, this.username, this.password);
      if(!isSignedUp) this.errorMessage = "Une erreur est survenue.";
    }
  }

  private isEmailValid() {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    return emailRegex.test(this.email);
  }

  private isUsernameValid() {
    // Restriction : maximum 15 caractères
    return this.username.length <= 15 && this.username !== "";
  }

  private isPasswordValid() {
    // Restriction: minimum 8 caractères avec une lettre et un nombre.
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(this.password);
  }

  private doPasswordsMatch() {
    return this.password === this.confirmPassword;
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
