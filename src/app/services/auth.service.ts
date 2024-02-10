import { Injectable, inject } from '@angular/core';
import { Auth, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUser: User | null = null;
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;

  constructor() {
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
      if(aUser) {
        console.log(aUser);
        this.currentUser = aUser;
      } else {
        console.log("No currently logged user");
        this.currentUser = null;
      }
    })
  }

  async signUp(email: string, username: string, password: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch  {
      return false;
    }
  } 

  async signIn(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch {
      return false;
    }
  }

  async signOut() {
    await signOut(this.auth);
  }

}
