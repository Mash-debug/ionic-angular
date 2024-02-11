import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Clip, ClipsService } from '../services/clips.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent  implements OnInit {
  @ViewChild(IonModal) modal: IonModal | undefined;
  @Input() thumbnail: string = '';
  @Input({required: true}) title: string = '';
  @Input({required: true}) idClip: string = '';
  newClipTitle: string = '';
  newClipThumbnail: string = '';
  errorMessage: string = '';
  defaultImgPath: string = '../../assets/outplayed_white.webp'

  constructor(private clipsService: ClipsService, private authService: AuthService) { }

  ngOnInit() {
    this.newClipTitle = this.title;
    this.newClipThumbnail = this.thumbnail ? this.thumbnail : "";
  }

  
  cancel() {
    this.modal!.dismiss(null, 'cancel');
  }

  editClipHandler() {
    
    const clip = {
      id: this.idClip,
      title: this.newClipTitle,
      thumbnail: this.newClipThumbnail,
      createdAt: new Date(),
      // file: this.newClipFile
    };

    if(!this.newClipTitle) {
      this.errorMessage = "Un ou plusieurs champs ne sont pas remplis.";
      return;
    }

    // if(!this.newClipFile || !this.newClipTitle) {
    //   this.errorMessage = "Un ou plusieurs champs ne sont pas remplis.";
    //   return;
    // }

    this.modal!.dismiss(clip, 'confirm');
    // this.modal!.dismiss(clip, 'confirm');
  }

  onWillDismiss(event: Event) {
    const e = event as CustomEvent<OverlayEventDetail<Clip>>;
    if (e.detail.role === 'confirm') {
      const clip = e.detail.data;
      this.editClip(clip!);
    }
  }

  async editClip(clip: Clip) {
    // Sur Firebase
    const isUpdated = await this.clipsService.editClip(this.authService.currentUser?.uid!, clip);

    if(!isUpdated) {
      this.errorMessage = "Une erreur est survenue. Veuillez réessayer.";
      this.modal?.present();
      return;
    }

    // Localement
    this.title = clip.title;
    this.thumbnail = clip.thumbnail;
    this.errorMessage = "";
  }

  setDefaultImgPath() {
    this.thumbnail = this.defaultImgPath;
  }

}
