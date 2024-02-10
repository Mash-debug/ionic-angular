import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Clip, ClipsService } from '../services/clips.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  clips: Clip[] = [];
  authStateSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private clipsService: ClipsService, private router: Router) { }

  ionViewWillEnter() {
    this.authStateSubscription = this.authService.authState$.subscribe((aUser: User | null) => {
      if(!aUser) {
        this.router.navigate(["/login"]);
      } else {
        this.getClips();
      }
    })
  }

  ionViewDidLeave(): void {
    this.authStateSubscription?.unsubscribe();
  }

  async getClips() {
    this.clips = await this.clipsService.getClips(this.authService.currentUser?.uid!);
  }
}
