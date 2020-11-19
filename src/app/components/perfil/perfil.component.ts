import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { UserService } from '../../services/user.service';
import { PaisService } from '../../services/pais.service';
import { ListService } from '../../services/list.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit, OnDestroy {
  appUser: UserModel;
  appUserSub: Subscription;
  paises: any[] = [];
  private paisesSub: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private modalService: ModalService,
    private paisService: PaisService,
    public listService: ListService
  ) {}

  ngOnInit() {
    this.appUserSub = this.authService.appUser$.subscribe((data) => {
      if (data) {
        this.appUser = data;
      }
    });
    this.paisesSub = this.paisService.getPaises().subscribe((paises) => {
      this.paises = paises;
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
    this.paisesSub.unsubscribe();
  }
}
