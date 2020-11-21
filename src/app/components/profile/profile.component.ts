// ANGULAR
import { Component, OnDestroy, OnInit } from '@angular/core';

// RXJS
import { Subscription } from 'rxjs';

// SERVICES
import { AuthService } from '../../services/auth.service';
import { ListService } from '../../services/list.service';
import { ModalService } from '../../services/modal.service';
import { CountryService } from '../../services/country.service';
import { UserService } from '../../services/user.service';

// MODELS
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  appUser: UserModel;
  appUserSub: Subscription;
  countries: any[] = [];
  private countriesSub: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private modalService: ModalService,
    private countryService: CountryService,
    public listService: ListService
  ) {}

  ngOnInit() {
    this.appUserSub = this.authService.appUser$.subscribe((data) => {
      if (data) {
        this.appUser = data;
      }
    });
    this.countriesSub = this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  openModal() {
    this.modalService.switchModal();
  }

  saveData(userForm) {
    this.userService.saveUserData(this.appUser.key, userForm);
    if (this.authService.userGoogle) {
      this.authService.userGoogle.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.appUserSub.unsubscribe();
    this.countriesSub.unsubscribe();
  }
}
