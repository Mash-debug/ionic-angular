import { Component } from '@angular/core';
import { ClipsService, LocalClip } from '../services/clips.service';
import { AuthService } from '../services/auth.service';
import { Timestamp } from '@angular/fire/firestore';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  newClipTitle: string = "";
  newClipThumbnail: string = "";
  newClipFile: string = "";
  errorMessage: string = "";
  confirmMessage: string = "";

  constructor(private clipsService: ClipsService, private authService: AuthService) {}

  async addClipHandler() {
    if(!this.newClipTitle || !this.newClipFile) {
      this.errorMessage = "Un ou plusieurs champs sont vides";
      return;
    } else if(!this.isValidURL(this.newClipFile)) {
      this.errorMessage = "URL(s) non valide(s).";
      return;
    }

    this.errorMessage = "";

    const clip: LocalClip = {
      createdAt: new Date() as unknown as Timestamp,
      title: this.newClipTitle,
      thumbnail: this.newClipThumbnail,
      file: this.newClipFile
    };

    // Ajouter le clip sur Firebase
    const isAdded = await this.clipsService.addClip(this.authService.currentUser?.uid!, clip);
    if(isAdded) {
      // Ajouter localement
      
      this.newClipTitle = "";
      this.newClipThumbnail = "";
      this.newClipFile = "";
      this.confirmMessage = "Nouveau clip ajouté !";
      setTimeout(() => {
        this.confirmMessage = "";
      }, 3000)
    }

  }

  private isValidURL(url: string) {
    const regexURL = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return regexURL.test(url);
  }

  
}
