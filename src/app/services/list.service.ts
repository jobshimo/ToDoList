import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app'; 

@Injectable({
  providedIn: 'root',
})
export class ListService implements OnInit {
  public lists: Observable<any>;
  public list: Observable<any>;

  constructor(private db: AngularFirestore) {}
  ngOnInit(): void {}

  newList(key, data) {
    this.db
      .collection('users')
      .doc(key)
      .collection('Listas')
      .doc(data.key)
      .set(data, { merge: true });
  }

  getListas(key) {
    this.lists = this.db
      .collection('users')
      .doc(key)
      .collection('Listas')
      .valueChanges();
  }
  getLista(key, doc) {
    this.list = this.db
      .collection('users')
      .doc(key)
      .collection('Listas').doc(doc)
      .valueChanges();
  }

  deletList(user, doc){
    this.db
    .collection('users')
    .doc(user)
    .collection('Listas')
    .doc(doc).delete().then(res=>  Swal.fire('Delet list', 'Delete successfully', 'success')
    )
  }
  deletItem(user, doc, item){

    this.db
    .collection('users')
    .doc(user)
    .collection('Listas')
    .doc(doc).update({
      "tareas": firebase.firestore.FieldValue.arrayRemove(item)
  });
 
  }
  addItem(user, doc, item){

    this.db
    .collection('users')
    .doc(user)
    .collection('Listas')
    .doc(doc).update({
      "tareas": firebase.firestore.FieldValue.arrayUnion(item)
  });
 
  }
}
