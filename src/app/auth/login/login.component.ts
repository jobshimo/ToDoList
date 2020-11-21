// ANGULAR
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// RXJS
import { Subscription } from 'rxjs';

// SERVICES
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  appUserGoogle$: Subscription;

  constructor(public authService: AuthService, private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit(): void {
       if (localStorage.getItem('email')) {
      const rememberMe = localStorage.getItem('email');
      this.formLogin.patchValue({ email: rememberMe });
      this.formLogin.patchValue({ remember: true });
    }
  }

  createForm() {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  get invalidUser() {
    return (
      this.formLogin.get('email').invalid && this.formLogin.get('email').touched
    );
  }
  get invalidPass() {
    return (
      this.formLogin.get('password').invalid &&
      this.formLogin.get('password').touched
    );
  }


  login() {
    if (this.formLogin.invalid) {
      return;
    }
    this.authService.signIn(
      this.formLogin.value.email,
      this.formLogin.value.password
    );
   this.remeberMe();
  }

  loginGoogle() {
    this.authService.GoogleAuth();
    this.remeberMe();
  }

  remeberMe(){
    if (this.formLogin.value.remember === true) {
      localStorage.setItem('email', this.formLogin.value.email);
    } else {
      localStorage.removeItem('email');
    }
  }
}
