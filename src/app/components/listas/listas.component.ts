import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { List, newList } from 'src/app/models/list.model';
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';
import Swal from 'sweetalert2';
import { first } from 'rxjs/operators';
import { ListItem } from 'src/app/models/list-item.model';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.scss'],
})
export class ListasComponent implements OnInit, OnDestroy {
  listas: List[] = [];
  appUser: UserModel;
  appUserSub: Subscription;

  constructor(
    private listService: ListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.appUserSub = this.authService.appUser$.subscribe((data) => {
      if (data) {
        this.appUser = data;
        this.listService
          .getListSuazo(this.appUser.key)
          .pipe(first())
          .toPromise()
          .then((data) => {
            this.listas = data;
          });
      }
    });
  }

  removeItem(listIndex: number, itemIndex: number) {
    let newElement = this.listas[listIndex];
    newElement.items.splice(itemIndex, 1);
    this.listService.deleteItem(newElement);
  }

  async editItem(listIndex: number, itemIndex: number) {
    let newElement = this.listas[listIndex];

    const { value = '' } = await Swal.fire<string>({
      title: 'Edit Item',
      text: 'Enter the name of the new item',
      input: 'text',
      inputValue: newElement.items[itemIndex].item,
      inputPlaceholder: 'Item name',
      showCancelButton: true,
    });
    if (value.trim().length > 0) {
      let newItem: ListItem = {
        isFinished: false,
        item: value,
      };
      newElement.items.splice(itemIndex, 1, newItem);
      this.listService.deleteItem(newElement);
    }
  }
  checkItem(listIndex: number, itemIndex: number) {
    let newElement = this.listas[listIndex];
    let newItem: ListItem = {
      item: newElement.items[itemIndex].item,
      isFinished: !newElement.items[itemIndex].isFinished,
    };
    newElement.items.splice(itemIndex, 1, newItem);
    this.listService.deleteItem(newElement);
  }

  newList(listName: string) {
    let list: List = newList;
    list.title = listName;
    this.listas.push(list);
    this.listService.newList(this.appUser.key, list);
  }

  async createList() {
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

  async addNewItem(listIndex: number) {
    const { value = '' } = await Swal.fire<string>({
      title: 'Create Item',
      text: 'Enter the name of the new item',
      input: 'text',
      inputPlaceholder: 'Item name',
      showCancelButton: true,
    });
    if (value.trim().length > 0) {
      let newItem: ListItem = {
        isFinished: false,
        item: value,
      };
      this.listas[listIndex].items.push(newItem);
      this.listService.addItem(this.listas[listIndex], newItem);
    }
  }

  deleteList(listIndex: number) {
    Swal.fire({
      title: 'Delete list?',
      text: `You are about to delete the list: "${this.listas[listIndex].title}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listService.deleteList(this.listas[listIndex]);
        this.listas.splice(listIndex, 1);
      }
    });
  }

  ngOnDestroy(): void {
    this.appUserSub.unsubscribe();
  }
}
