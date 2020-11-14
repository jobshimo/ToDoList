import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  keyUser: string;
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.appUser$.subscribe((data: UserModel) => {
      if (data) {
        this.keyUser = data.key;
      }
    });
  }

  salir() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
