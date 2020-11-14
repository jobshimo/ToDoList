import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit, OnDestroy {
  appUser: UserModel;
  appUserSub: Subscription;
  listasSub: Subscription;
  paramsSub: Subscription;
  lista: any[] = [];
  docKey: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.activatedRoute.params.subscribe(
      (params: any) => (this.docKey = params['id'])
    );

    this.appUserSub = this.authService.appUser$.subscribe((data) => {
      if (data) {
        this.appUser = data;
        this.listService.getLista(this.appUser.key, this.docKey);
        this.listasSub = this.listService.list.subscribe(({ tareas }) => {
          this.lista = tareas;
        });
      }
    });
  }

  async abrirSwal(user, key) {
    const { value = '' } = await Swal.fire<string>({
      title: 'Create Item',
      text: 'Enter the name of the new item',
      input: 'text',
      inputPlaceholder: 'Item name',
      showCancelButton: true,
    });

    if (value.trim().length > 0) {
      this.addItem(user, key, value);
    }
  }

  addItem(user, key, item) {
    this.listService.addItem(user, key, item);
  }

  deletList(user, key, item) {
    Swal.fire({
      title: 'Delete item?',
      text: `You are about to delete the list: "${item}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listService.deletItem(user, key, item);
      }
    });
  }
  async editItem(user, key, item) {
    const { value = '' } = await Swal.fire<string>({
      title: 'Edit Item',
      text: 'Enter the new name of the item',
      input: 'text',
      inputPlaceholder: 'Item name',
      showCancelButton: true,
    });

    if (value.trim().length > 0) {
      this.listService.deletItem(user, key, item);

      this.listService.addItem(user, key, value);
    }
  }

  checkItem(user, key, item) {
    this.listService.deletItem(user, key, item);
    this.listService.addItem(user, key, `${item} - FINISH`);
  }
  desCheckItem(user, key, item) {
    this.listService.deletItem(user, key, item);
    this.listService.addItem(user, key, item.slice(0, -9));
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
    this.appUserSub.unsubscribe();
    this.listasSub.unsubscribe();
  }
}
