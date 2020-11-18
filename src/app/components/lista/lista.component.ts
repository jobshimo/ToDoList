import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
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
  name: string;
  preba: boolean;

  arrayPrueba:Object = { item: 'Cosas por hacer', isFinished: false };

  @Input() docKey: string;
  @Input() userKey: string;

  constructor(private listService: ListService) {}

  ngOnInit(): void {
    // NO BORRAR AUN
    // ({ nombre, tareas }) => {
    //   this.lista = tareas;
    //   this.name = nombre;
    //   console.log('hola');

    //   console.log(this.lista);
    // }
    //

    this.listService.getLista(this.userKey, this.docKey);
    this.listService.list
      .pipe(first())
      .toPromise()
      .then(({ nombre, tareas }) => {
        this.lista = tareas;
        this.name = nombre;
        console.log(this.lista);
      });
  }

  async prueba() {
    let prueba = await this.listService
      .pruebaSuazo(this.userKey, this.docKey)
      .then(({ tareas }) => console.log(tareas));
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
      // this.addItem(user, key, value);
    }
  }

  // addItem(user, key, item) {
  //   this.listService.addItem(user, key, item);
  // }

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

      // this.listService.addItem(user, key, value);
    }
  }
  turnData(data){
    console.log(data);
    const postData = JSON.parse(JSON.stringify(data));
    return postData;
    
  }

  checkItem(user, key, item, id) {
    const postData = JSON.parse(JSON.stringify(this.arrayPrueba));
    this.listService.deletItem(user, key, item);
    // this.listService.addItem(user, key,postData);
    console.log(postData);
    
  }
  desCheckItem(user, key, item) {
    this.listService.deletItem(user, key, item);
    // this.listService.addItem(user, key, item.slice(0, -9));
  }
  

  ngOnDestroy(): void {
    // this.appUserSub.unsubscribe();
    // this.listasSub.unsubscribe();
  }
}
