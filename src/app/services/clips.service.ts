import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ClipsService {
  private firestore: Firestore = inject(Firestore);

  constructor() {};

  async getClips(userId: string) {
    return (
      (await getDocs(query(collection(this.firestore, `users/${userId}/clips`)))).docs.map((clips) => clips.data()) as Clip[]
    )
  }

}

export interface Clip {
  createdAt: Date;
  title: string;
  thumbnail: string;
}