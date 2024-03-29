import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, updateDoc, doc, addDoc, Timestamp, deleteDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ClipsService {
  private firestore: Firestore = inject(Firestore);

  constructor() {};

  async getClips(userId: string) {
    return (
      (await getDocs(query(collection(this.firestore, `users/${userId}/clips`)))).docs.map((clips) => ({
        ...clips.data(),
        id: clips.id,
      })) as Clip[]
    )
  }

  async editClip(userId: string, clip: Clip) {
    const clipRef = doc(this.firestore, `users/${userId}/clips`, clip.id)
    const data = {
      title: clip.title,
      thumbnail: clip.thumbnail,
      createdAt: clip.createdAt,
      file: clip.file
    };

    try {
      await updateDoc(clipRef, data);
      return true;
    } catch {
      return false;
    }
  }

  async addClip(userId: string, clip: LocalClip) {
    const clipRef = collection(this.firestore, `users/${userId}/clips`);

    try {
      await addDoc(clipRef, clip);
      return true;
    } catch {
      return false;
    }
  }

  async deleteClip(userId: string, idClip: string) {
    const clipRef = doc(this.firestore, `users/${userId}/clips`, idClip);

    try {
      await deleteDoc(clipRef);
      return true;
    } catch {
      return false;
    }
  }

}

export interface LocalClip {
  createdAt: Timestamp;
  title: string;
  thumbnail: string;
  file: string;
}

export interface Clip extends LocalClip {
  id: string;
}