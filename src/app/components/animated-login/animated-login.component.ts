import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
@Component({
  selector: 'app-animated-login',
  templateUrl: './animated-login.component.html',
  styleUrls: ['./animated-login.component.scss'],
})
export class AnimatedLoginComponent implements OnInit {
  // Variables:
  usuario: UserModel ;
  recordarme = false;
  formLogin: FormGroup;
  formRegistro: FormGroup;

  // --FIN VARIABLES--
  // Constructor:
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }
  // --FIN CONSTRUCTOR--

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

  //  --FIN GET FORMULARIO

  //Metodos:
  classLogin: string = 'container animated flipInY';
  classRegistro: string = 'container disabled';
  vostearLogin() {
    this.classLogin = 'container animated flipOutY slow';
    this.classRegistro = 'container animated flipInY slow';
  }
  vostearRegistro() {
    this.classRegistro = 'container animated flipOutY slow';
    this.classLogin = 'container animated flipInY slow';
  }

  // Formulaio:
  crearFormularioRegistro() {
    this.formRegistro = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  // --FIN FORMULARIO--

  registroUsuario() {
    console.log(this.formRegistro.value);
    this.authService.signUp(
      this.formRegistro.value.email,
      this.formRegistro.value.password,
      this.formRegistro.value.name
    );
    this.router.navigate(['login']);
  }

  // Metodos:
  // formulario:
  crearFormulario() {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  //  --FIN FORMULARIO--

  ngOnInit(): void {
    this.crearFormularioRegistro();
    // console.log(this.authService.isSignIn2);
    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordarme = true;
    }
    // this.authService.isAuth().subscribe((user) => {
    //   if (user) {
    //     this.router.navigateByUrl('/home');
    //   }
    // });
  }
  login() {
    if (this.formLogin.invalid) {
      console.log('Formulario no valido');
      return;
    }

    console.log(this.formLogin.value);
    this.authService.signIn(
      this.formLogin.value.email,
      this.formLogin.value.password
    );
  }
  // --FIN METODOS--
}
