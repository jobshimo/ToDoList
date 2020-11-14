import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore) {}

  saveUserData(key, userForm) {
try {
  const UPDATEUSER = this.userUpdater(userForm);
  
  this.db.doc(`users/${key}`).set(UPDATEUSER, { merge: true });

  Swal.fire('Update Profile', 'Information saved successfully', 'success');
  
} catch (error) {
  console.log(error);
  
  
}

  }
  saveUserImg(key, img) {
    const UPDATEIMG = this.userImg(img);

    this.db.doc(`users/${key}`).set(UPDATEIMG, { merge: true });
  }

  userUpdater(form) {
    const UPDATEUSER = {
      name: form.form.value.name,
      surname: form.form.value.surname,
      address1: form.form.value.address1,
      address2: form.form.value.address2,
      city: form.form.value.city,
      state: form.form.value.state,
      img: form.form.value.img,
    };
    return UPDATEUSER;
  }
  userImg(img) {
    const UPDATEIMG = {
      img: img,
    };
    return UPDATEIMG;
  }
}
