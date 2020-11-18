import { Injectable, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
import { first } from 'rxjs/operators';
import { List } from '../models/list.model';
import { UserModel } from '../models/user.model';
import { ListItem } from '../models/list-item.model';

@Injectable({
  providedIn: 'root',
})
export class ListService implements OnInit {
  public lists: Observable<any>;
  public list: Observable<any>;

  constructor(private db: AngularFirestore) {}
  ngOnInit(): void {}

  getListas(key) {
    this.lists = this.db
      .collection('users')
      .doc(key)
      .collection('Listas')
      .valueChanges();
  }

  // Creado por Suazo
  getListSuazo(userKey: UserModel['key']): Observable<List[]> {
    return this.db
      .collection<List>('listas', (ref) => {
        ref.where('owner', '==', userKey);
        return ref.orderBy('createdDate');
      })
      .valueChanges();
  }
  // Modificado con Suazo
  newList(userKey: string, data: List) {
    data.id = this.db.createId();
    data.owner = userKey;
    this.db.doc(`listas/${data.id}`).set(data);
  }

  addItem(lista: List, item: ListItem) {
    this.db.doc(`listas/${lista.id}`).update({
      items: firebase.firestore.FieldValue.arrayUnion( item ),
    });
  }

  deleteItem(lista: List) {
    this.db.doc(`listas/${lista.id}`).set(lista, { merge: true });

  }
  deleteList(lista: List) {
    this.db
      .doc(`listas/${lista.id}`)
      .delete()
      .then(() => Swal.fire('Delet list', 'Delete successfully', 'success'));
  }

  // fin nuevo

  getListasPromise(key) {
    return this.db
      .collection('users')
      .doc(key)
      .collection('Listas')
      .valueChanges()
      .pipe(first())
      .toPromise();
  }
  getLista(key, doc) {
    this.list = this.db
      .collection('users')
      .doc(key)
      .collection('Listas')
      .doc(doc)
      .valueChanges();
  }

  public pruebaSuazo(key, doc) {
    return this.db
      .collection('users')
      .doc(key)
      .collection('Listas')
      .doc(doc)
      .valueChanges()
      .pipe(first())
      .toPromise();
  }

  deletList(user, doc) {
    this.db
      .collection('users')
      .doc(user)
      .collection('Listas')
      .doc(doc)
      .delete()
      .then((res) => Swal.fire('Delet list', 'Delete successfully', 'success'));
  }
  deletItem(user, doc, item) {
    this.db
      .collection('users')
      .doc(user)
      .collection('Listas')
      .doc(doc)
      .update({
        tareas: firebase.firestore.FieldValue.arrayRemove(item),
      });
  }
  addItemOld(user, doc, item) {
    this.db
      .collection('users')
      .doc(user)
      .collection('Listas')
      .doc(doc)
      .update({
        tareas: firebase.firestore.FieldValue.arrayUnion(item),
      });
  }
}
