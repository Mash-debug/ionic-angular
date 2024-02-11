import { Component, DoCheck } from '@angular/core';
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
export class Tab1Page implements DoCheck {
  clips: Clip[] = [];
  authStateSubscription: Subscription | null = null;
  clipsInit: boolean = false;

  constructor(private authService: AuthService, private clipsService: ClipsService, private router: Router) { }

  ionViewWillEnter() {
    this.authStateSubscription = this.authService.authState$.subscribe((aUser: User | null) => {
      if(!aUser) {
        this.clips = [];
        this.clipsInit = false;
        this.router.navigate(["/login"]);
      }
    })
  }

  ionViewDidLeave(): void {
    this.authStateSubscription?.unsubscribe();
  }

  async getClips() {
    this.clips = await this.clipsService.getClips(this.authService.currentUser?.uid!);
    console.log(this.clips)
  }

  refreshBtnHandler() {
    this.getClips();
  }

  ngDoCheck(): void {
    if(this.authService.currentUser && !this.clipsInit) {
      this.getClips();
      this.clipsInit = true;
    }
  }
  
}
