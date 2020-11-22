// ANGULAR
import { Component, OnDestroy, OnInit } from '@angular/core';

// RXJS
import { Subscription } from 'rxjs';

// SERVICES
import { AuthService } from 'src/app/services/auth.service';
import { ListService } from 'src/app/services/list.service';
import { SwalService } from 'src/app/services/swal.service';

// MODELS
import { List, newList } from 'src/app/models/list.model';
import { ListItem, ListItemModel } from 'src/app/models/list-item.model';
import { DayLists, newDayLists } from 'src/app/models/day-lists.model';
import { UserModel } from 'src/app/models/user.model';

// EXTERNAL
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit, OnDestroy {
  listsByday: DayLists[] = [];
  appUser: UserModel;
  appUserSub: Subscription;
  listsSub: Subscription;
  show: boolean;
  loading: boolean;
  constructor(
    private listService: ListService,
    private authService: AuthService,
    private SwalService: SwalService
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
            this.listsByday = this.getListsOrderByDay(data);
            this.loading = false;
            if (data.length === 0) {
              this.show = true;
            } else {
              this.show = false;
            }
          });
      }
    });
  }

  checkListIsFinished(dayIndex: number, listIndex: number) {
    let list = this.listsByday[dayIndex].lists[listIndex];
    for (let i = 0; i < list.items.length; i++) {
      if (list.items[i].isFinished != true) {
        list.finishedData = null;
        list.isFinished = false;
        this.listService.editList(list);
        return;
      }
    }
    list.finishedData = new Date();
    list.isFinished = true;
    this.listService.editList(list);
  }

  public itemsToFinish(dayIndex: number, listIndex: number): number {
    let toFinish: number = this.listsByday[dayIndex].lists[listIndex].items
      .length;
    for (let i = 0; i < toFinish; i++) {
      if (
        this.listsByday[dayIndex].lists[listIndex].items[i].isFinished != true
      ) {
        toFinish--;
      }
    }
    return toFinish;
  }

  getListsOrderByDay(lists: List[]): DayLists[] {
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

  newList(listName: string) {
    let list: List = newList;
    list.title = listName;
    this.listService.newList(this.appUser.key, list);
  }

  async createList() {
    let value = await this.SwalService.swalModalAllString(
      'Create List',
      'Enter the name of the new list',
      'Lists name'
    );
    if (value.trim().length > 0) {
      this.newList(value);
    }
  }

  async editList(dayIndex: number, listIndex: number) {
    let value = await this.SwalService.swalModalInputValue(
      'Edit List',
      'Enter the new name of the list',
      this.listsByday[dayIndex].lists[listIndex].title,
      'List name'
    );
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
    let value = await this.SwalService.swalModalAllString(
      'Create Item',
      'Enter the name of the new item',
      'Item name'
    );
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
    let list = this.listsByday[dayIndex].lists[listIndex];
    let value = await this.SwalService.swalModalInputValue(
      'Edit Item',
      'Enter the new name of the item',
      list.items[itemIndex].item,
      'Item name'
    );
    if (value.trim().length > 0) {
      let newItem: ListItem = {
        ...ListItemModel,
        item: value,
      };
      list.items.splice(itemIndex, 1, newItem);
      this.listService.deleteItem(list);
    }
  }
  async checkItem(dayIndex: number, listIndex: number, itemIndex: number) {
    let item = this.listsByday[dayIndex].lists[listIndex].items;
    let newItem: ListItem = {
      item: item[itemIndex].item,
      isFinished: !item[itemIndex].isFinished,
    };
    item.splice(itemIndex, 1, newItem);
    this.listService.deleteItem(this.listsByday[dayIndex].lists[listIndex]);
    this.checkListIsFinished(dayIndex, listIndex);
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
