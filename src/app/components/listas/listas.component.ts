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
  listsByday: DayLists[] = [];
  appUser: UserModel;
  appUserSub: Subscription;
  listsSub: Subscription;
  show: boolean;
  loading: boolean;
  constructor(
    private listService: ListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.show = false;
    this.loading = true;
    this.appUserSub = this.authService.appUser$.subscribe((data) => {
      if (data) {
        this.appUser = data;
        this.listsSub = this.listService
          .getLists(this.appUser.key)
          .subscribe((data) => {
            this.listsByday = this.getTistsOrderByDay(data);
            this.loading = false
            if (data.length === 0) {
              this.show = true;
              console.log('hola');
            } else {
              this.show = false;
            }
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
    return listsByDay;
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

  async editList(dayIndex: number, listIndex: number) {
    const { value = '' } = await Swal.fire<string>({
      title: 'Edit List',
      text: 'Enter the new name of the list',
      input: 'text',
      inputValue: this.listsByday[dayIndex].lists[listIndex].title,
      inputPlaceholder: 'List name',
      showCancelButton: true,
    });

    if (value.trim().length > 0) {
      this.listsByday[dayIndex].lists[listIndex].title = value;
      this.listService.editList(this.listsByday[dayIndex].lists[listIndex]);
    }
  }

  deleteList(dayIndex: number, listIndex: number) {
    Swal.fire({
      title: 'Delete list?',
      text: `You are about to delete the list: "${this.listsByday[dayIndex].lists[listIndex].title}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listService.deleteList(this.listsByday[dayIndex].lists[listIndex]);
        this.listsByday[dayIndex].lists.splice(listIndex, 1);
      }
    });
  }

  async addNewItem(dayIndex: number, listIndex: number) {
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
      this.listsByday[dayIndex].lists[listIndex].items.push(newItem);
      this.listService.addItem(
        this.listsByday[dayIndex].lists[listIndex],
        newItem
      );
    }
  }

  removeItem(dayIndex: number, listIndex: number, itemIndex: number) {
    this.listsByday[dayIndex].lists[listIndex].items.splice(itemIndex, 1);
    this.listService.deleteItem(this.listsByday[dayIndex].lists[listIndex]);
  }

  async editItem(dayIndex: number, listIndex: number, itemIndex: number) {
    const { value = '' } = await Swal.fire<string>({
      title: 'Edit Item',
      text: 'Enter the new name of the item',
      input: 'text',
      inputValue: this.listsByday[dayIndex].lists[listIndex].items[itemIndex]
        .item,
      inputPlaceholder: 'Item name',
      showCancelButton: true,
    });
    if (value.trim().length > 0) {
      let newItem: ListItem = {
        ...ListItemModel,
        item: value,
      };
      this.listsByday[dayIndex].lists[listIndex].items.splice(
        itemIndex,
        1,
        newItem
      );
      this.listService.deleteItem(this.listsByday[dayIndex].lists[listIndex]);
    }
  }
  checkItem(dayIndex: number, listIndex: number, itemIndex: number) {
    let newItem: ListItem = {
      item: this.listsByday[dayIndex].lists[listIndex].items[itemIndex].item,
      isFinished: !this.listsByday[dayIndex].lists[listIndex].items[itemIndex]
        .isFinished,
    };
    this.listsByday[dayIndex].lists[listIndex].items.splice(
      itemIndex,
      1,
      newItem
    );
    this.listService.deleteItem(this.listsByday[dayIndex].lists[listIndex]);
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
