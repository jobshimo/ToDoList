import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.scss'],
})
export class ListasComponent implements OnInit, OnDestroy {
  listas: any[] = [];
  appUser: UserModel;
  appUserSub: Subscription;
  listasSub: Subscription;

  constructor(
    private listService: ListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.appUserSub = this.authService.appUser$.subscribe((data) => {
      if (data) {
        this.appUser = data;
        this.listService.getListas(this.appUser.key);
        this.listasSub = this.listService.lists.subscribe(
          (res) => (this.listas = res)
        );
      }
    });
  }

  newList(listName) {
    let data = {
      key: new Date().getTime().toString(),
      nombre: listName,
      tareas: [],
    };

    this.listService.newList(this.appUser.key, data);
  }

  log(cosas) {
    console.log(cosas);
  }

  async abrirSwal() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Create List',
      text: 'Enter the name of the new list',
      input: 'text',
      inputPlaceholder: 'Lists name',
      showCancelButton: true,
    });

    if (value.trim().length > 0) {
      this.newList(value);
    }
  }
  deletList(user, key, list) {
    Swal.fire({
      title: 'Delete list?',
      text: `You are about to delete the list: "${list}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listService.deletList(user, key);
      }
    });
  }

  ngOnDestroy(): void {
    this.listasSub.unsubscribe();
    this.appUserSub.unsubscribe();
  }
}
