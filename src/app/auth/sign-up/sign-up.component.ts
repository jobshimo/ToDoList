import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm();
  }

  get invalidUser() {
    return (
      this.signUpForm.get('email').invalid &&
      this.signUpForm.get('email').touched
    );
  }
  get invalidName() {
    return (
      this.signUpForm.get('name').invalid && this.signUpForm.get('name').touched
    );
  }
  get invalidPass() {
    return (
      this.signUpForm.get('password').invalid &&
      this.signUpForm.get('password').touched
    );
  }

  registerForm() {
    this.signUpForm = this.fb.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signUpUser() {
    if (this.signUpForm.invalid) {
      return;
    } else {
      this.authService.signUp(
        this.signUpForm.value.email,
        this.signUpForm.value.password,
        this.signUpForm.value.name
      );
      this.router.navigate(['login']);
    }
  }
}
