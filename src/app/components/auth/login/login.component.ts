// From Angular:
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Servicios:
import { AuthService } from '../../../services/auth.service';

// Modelos:
import { UserModel } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';

// --FIN IMPORTACIONES--

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // Variables:

  usuario: UserModel = new UserModel();
  recordarme = false;
  formLogin: FormGroup;
  appUserGoogle$: Subscription;

  // --FIN VARIABLES--

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
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

  // Get para el formularios:

  get usuarioNoValido() {
    return (
      this.formLogin.get('email').invalid && this.formLogin.get('email').touched
    );
  }
  get passNoValido() {
    return (
      this.formLogin.get('password').invalid &&
      this.formLogin.get('password').touched
    );
  }

  // --FIN GET FORMULARIO--

  // Formulario:

  crearFormulario() {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  //  --FIN FORMULARIO--

  // Metodos:
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

  loginGoogle() {
    this.authService.GoogleAuth();
  }
  // --FIN METODOS--
}
