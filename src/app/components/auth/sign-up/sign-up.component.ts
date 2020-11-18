import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  // Variables:

  usuario: UserModel;
  recordarme = false;
  formRegistro: FormGroup;

  // --FIN VARIABLES--

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.crearFormularioRegistro();
  }

  // Get para el formulario:

  get usuarioNoValido() {
    return (
      this.formRegistro.get('email').invalid &&
      this.formRegistro.get('email').touched
    );
  }
  get nombreNoValido() {
    return (
      this.formRegistro.get('name').invalid &&
      this.formRegistro.get('name').touched
    );
  }
  get passNoValido() {
    return (
      this.formRegistro.get('password').invalid &&
      this.formRegistro.get('password').touched
    );
  }

  //  --FIN GET FORMULARIO--

  // Formulaio:
  crearFormularioRegistro() {
    this.formRegistro = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  // --FIN FORMULARIO--

  //Metodos:
  registroUsuario() {
    console.log(this.formRegistro.value);
    this.authService.signUp(
      this.formRegistro.value.email,
      this.formRegistro.value.password,
      this.formRegistro.value.name
    );
    this.router.navigate(['login']);
  }
}
