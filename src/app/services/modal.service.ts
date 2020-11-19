// ANGULAR
import { Injectable } from '@angular/core';

// RXJS
import { finalize } from 'rxjs/operators';

// MODELS
import { UserService } from './user.service';

// FIREBASE
import { FirebaseStorageService } from './firebase-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public _ocultarModal: boolean = true;
  public porcentaje = 0;

  constructor(
    private firebaseStorage: FirebaseStorageService,
    private userService: UserService
  ) {}
  switchModal() {
    this._ocultarModal = !this._ocultarModal;
  }

  subirArchivo(file, key) {
    let referencia = this.firebaseStorage.refCloudStorage(key);
    let upload = this.firebaseStorage.uploadCloudStorage(key, file);

    //Cambia el porcentaje
    upload
      .percentageChanges()
      .pipe(
        finalize(async () => {
          const photoURL = await referencia.getDownloadURL().toPromise();

          this.userService.saveUserImg(key, photoURL);
          this.switchModal();
        })
      )
      .subscribe((porcentaje) => {
        this.porcentaje = Math.round(porcentaje);
      });
  }
}
