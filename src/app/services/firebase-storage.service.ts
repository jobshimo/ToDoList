// ANGULAR
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  constructor(private storage: AngularFireStorage) {}

  //UPLOAD FILE
  public uploadCloudStorage(fileName: string, data: any) {
    return this.storage.upload(
      `users/${fileName}/${fileName}`,
      data
    );
  }

  //REF FIRE
  public refCloudStorage(fileName: string) {
    return this.storage.ref(`users/${fileName}/${fileName}`);
  }
}
