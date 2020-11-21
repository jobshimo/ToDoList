// ANGULAR
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// RXJS
import { Subscription } from 'rxjs';

// SERVICES
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from '../../services/modal.service';

// MODELS
import { UserModel } from 'src/app/models/user.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styles: [],
})
export class ModalComponent implements OnInit, OnDestroy {
  // VARIABLES
  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });

  public appUser: UserModel;
  public appUserSub: Subscription;
  public datosFormulario = new FormData();
  public imagenSubir: File;
  public imgTemp: any = null;
  public img: string;
  public nombreArchivo = '';

  constructor(
    public modalImagenService: ModalService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.appUserSub = this.authService.appUser$.subscribe((data) => {
      if (data) {
        this.appUser = data;
      }
    });
  }

  // METODOS

  cambiarImagen(file: File) {
    this.imagenSubir = file;
    if (!file) {
      return (this.imgTemp = null);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  //Evento cuando el input del archivo cambia
  cambioArchivo(event) {
    if (event.target.files.length > 0) {
      this.cambiarImagen(event.target.files[0]);
      for (let i = 0; i < event.target.files.length; i++) {
        this.nombreArchivo = event.target.files[i].name;
        this.datosFormulario.delete('archivo');
        this.datosFormulario.append(
          'archivo',
          event.target.files[i],
          event.target.files[i].name
        );
      }
    }
  }

  subirArchivo() {
    this.modalImagenService.subirArchivo(
      this.datosFormulario.get('archivo'),
      this.appUser.key
    );
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.switchModal();
  }

  ngOnDestroy() {
    this.appUserSub.unsubscribe();
  }
}
