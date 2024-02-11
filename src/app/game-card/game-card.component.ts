import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Clip, ClipsService } from '../services/clips.service';
import { AuthService } from '../services/auth.service';
import { Timestamp } from '@angular/fire/firestore';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
})
export class GameCardComponent  implements OnInit {
  @ViewChild(IonModal) modal: IonModal | undefined;
  @ViewChild("modalDetail") modalDetail: IonModal | undefined;
  @Input() thumbnail: string = '';
  @Input({required: true}) createdAt: Timestamp | undefined;
  @Input({required: true}) title: string = '';
  @Input({required: true}) file: string = '';
  @Input({required: true}) idClip: string = '';
  @Output() clipDeleted: EventEmitter<string> = new EventEmitter();
  newClipTitle: string = '';
  newClipThumbnail: string = '';
  newClipFile: string = '';
  errorMessage: string = '';
  errorMessageModalDetail: string = '';
  defaultImgPath: string = '../../assets/outplayed_white.webp'

  constructor(private clipsService: ClipsService, private authService: AuthService) { }

  ngOnInit() {
    this.newClipTitle = this.title;
    this.newClipThumbnail = this.thumbnail ? this.thumbnail : "";
    this.newClipFile = this.file;
  }

  
  cancel() {
    this.modal!.dismiss(null, 'cancel');
  }

  cancelDetail() {
    this.modalDetail!.dismiss(null, 'cancel');
  }


  editClipHandler() {
    
    const clip = {
      id: this.idClip,
      title: this.newClipTitle,
      thumbnail: this.newClipThumbnail,
      file: this.newClipFile,
      createdAt: new Date(),
    };

    if(!this.newClipTitle || !this.newClipFile) {
      this.errorMessage = "Un ou plusieurs champs ne sont pas remplis.";
      return;
    }

    if(!this.isValidURL(this.newClipFile) || !this.isValidURL(this.newClipThumbnail)) {
      this.errorMessage = "URL(s) non valide(s).";
      return;
    }

    this.modal!.dismiss(clip, 'confirm');
  }

  async deleteClipHandler() {
    const isDeleted = await this.clipsService.deleteClip(this.authService.currentUser?.uid!, this.idClip);
    if(!isDeleted) {
      this.errorMessageModalDetail = "Une erreur est survenue.";
      return;
    }
    this.errorMessageModalDetail = "";
    this.modalDetail!.dismiss(null, "deleted");
  }

  async viewClipHandler() {
    await Browser.open({url: this.file});
  }

  onWillDismiss(event: Event) {
    const e = event as CustomEvent<OverlayEventDetail<Clip>>;
    if (e.detail.role === 'confirm') {
      const clip = e.detail.data;
      this.editClip(clip!);
    } else if (e.detail.role === 'deleted') {
      this.clipDeleted.emit('deleted');
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
    this.file = clip.file;
    this.errorMessage = "";
  }

  setDefaultImgPath() {
    this.thumbnail = this.defaultImgPath;
  }

  private isValidURL(url: string) {
    const regexURL = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return regexURL.test(url);
  }

}
