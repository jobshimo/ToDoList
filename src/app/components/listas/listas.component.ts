// ANFULAR
import { Component, OnDestroy, OnInit } from '@angular/core';

// RXJS
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// SERVICES
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';

// MODELS
import { List, newList } from 'src/app/models/list.model';
import { ListItem, ListItemModel } from 'src/app/models/list-item.model';
import { DayLists, newDayLists } from 'src/app/models/day-lists.model';
import { UserModel } from 'src/app/models/user.model';

// EXTERNOS
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.scss'],
})
export class ListasComponent implements OnInit, OnDestroy {
  listas: List[] = [];
  appUser: UserModel;
  appUserSub: Subscription;
  listsSub: Subscription;
  constructor(
    private listService: ListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.appUserSub = this.authService.appUser$.subscribe((data) => {
      if (data) {
        this.appUser = data;
        this.listsSub = this.listService
          .getLists(this.appUser.key)
          .subscribe((data) => {
            this.listas = data;
            this.getTistsOrderByDay(this.listas);
            // console.log(this.listas[0].createdDate['seconds']);
          });
      }
    });
  }

  getTistsOrderByDay(lists: List[]) {
    let listsByDay: DayLists[] = [];
    let day: DayLists = newDayLists;
    for (let i = 0; i < lists.length; i++) {
      let dayTem = this.timeConverter(lists[i].createdDate['seconds']);
      if (listsByDay.find((dayList) => dayList.day === dayTem)) {
        listsByDay[
          listsByDay.findIndex((dayList) => (dayList.day = dayTem))
        ].lists.splice(0, 0, lists[i]);
      } else {
        day = {
          day: dayTem,
          lists: [lists[i]],
        };
        listsByDay.splice(0, 0, day);
      }
    }
    console.log(listsByDay);
  }

  timeConverter(UNIX_timestamp): string {
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear();
    let month = a.getMonth() + 1;
    let date = a.getDate();
    let time = `${date}/${month}/${year}`;
    return time;
  }

  trackByFn(index, item) {
    return index;
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  newList(listName: string) {
    let list: List = newList;
    list.title = listName;
    // this.listas = [...this.listas, list];
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

  async editList(listIndex: number) {
    const { value = '' } = await Swal.fire<string>({
      title: 'Edit List',
      text: 'Enter the new name of the list',
      input: 'text',
      inputValue: this.listas[listIndex].title,
      inputPlaceholder: 'List name',
      showCancelButton: true,
    });

    if (value.trim().length > 0) {
      this.listas[listIndex].title = value;
      this.listService.editList(this.listas[listIndex]);
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

  removeItem(listIndex: number, itemIndex: number) {
    this.listas[listIndex].items.splice(itemIndex, 1);
    this.listService.deleteItem(this.listas[listIndex]);
  }

  async editItem(listIndex: number, itemIndex: number) {
    const { value = '' } = await Swal.fire<string>({
      title: 'Edit Item',
      text: 'Enter the new name of the item',
      input: 'text',
      inputValue: this.listas[listIndex].items[itemIndex].item,
      inputPlaceholder: 'Item name',
      showCancelButton: true,
    });
    if (value.trim().length > 0) {
      let newItem: ListItem = {
        ...ListItemModel,
        item: value,
      };
      this.listas[listIndex].items.splice(itemIndex, 1, newItem);
      this.listService.deleteItem(this.listas[listIndex]);
    }
  }
  checkItem(listIndex: number, itemIndex: number) {
    let newItem: ListItem = {
      item: this.listas[listIndex].items[itemIndex].item,
      isFinished: !this.listas[listIndex].items[itemIndex].isFinished,
    };
    this.listas[listIndex].items.splice(itemIndex, 1, newItem);
    this.listService.deleteItem(this.listas[listIndex]);
  }

  ngOnDestroy(): void {
    if (this.appUserSub) {
      this.appUserSub.unsubscribe();
    }
    if (this.listsSub) {
      this.listsSub.unsubscribe();
    }
  }
}
