// ANGULAR
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  constructor(private storage: AngularFireStorage) {}

  //Tarea para subir archivo
  public uploadCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(
      `usuarios/${nombreArchivo}/${nombreArchivo}`,
      datos
    );
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(`usuarios/${nombreArchivo}/${nombreArchivo}`);
  }
}
