// ANGULAR
import { Injectable } from '@angular/core';

// RXJS
import { Observable } from 'rxjs';

// FIREBASE
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

// MODELS
import { List } from '../models/list.model';
import { ListItem } from '../models/list-item.model';
import { UserModel } from '../models/user.model';

// EXTERNOS
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class ListService {
  constructor(private db: AngularFirestore) {}

  getLists(userKey: UserModel['key']): Observable<List[]> {
    return this.db
      .collection<List>('listas', (ref) => {
        return ref.where('owner', '==', userKey).orderBy('createdDate');
      })
      .valueChanges();
  }

  newList(userKey: string, data: List): Promise<any> {
    data.id = this.db.createId();
    data.owner = userKey;
    return this.db.doc(`listas/${data.id}`).set(data);
  }

  editList(data: List) {
    this.db.doc(`listas/${data.id}`).set(data);
  }

  addItem(list: List, item: ListItem) {
    this.db.doc(`listas/${list.id}`).update({
      items: firebase.firestore.FieldValue.arrayUnion(item),
    });
  }

  deleteItem(list: List) {
    this.db.doc(`listas/${list.id}`).set(list, { merge: true });
  }

  deleteList(list: List) {
    this.db
      .doc(`listas/${list.id}`)
      .delete()
      .then(() => Swal.fire('Delet list', 'Delete successfully', 'success'));
  }
}
