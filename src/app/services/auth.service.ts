// ANGULAR
import { Injectable, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// RXJS
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// FIREBASE
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { auth } from 'firebase/app';

// MODELS
import { UserModel } from '../models/user.model';

// EXTERNAL
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit {
  isSignIn: boolean;
  appUser$: Observable<UserModel>;
  user: UserModel;
  userGoogle: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.getUser();
  }

  // Sign in with Google
  GoogleAuth() {
    this.AuthLogin(new auth.GoogleAuthProvider());
  }

  async AuthLogin(provider) {
    try {
      const user = await this.afAuth.auth.signInWithPopup(provider);
      this.userGoogle = this.db
        .doc(`users/${user.user.uid}`)
        .valueChanges()
        .subscribe((data) => {
          if (!data) {
            const name = user.additionalUserInfo.profile['given_name'];
            const NEWUSER = this.userGenerator(user, name);
            this.db.doc(`users/${user.user.uid}`).set(NEWUSER);
          }
        });
      this.zone.run(() => {
        this.router.navigateByUrl('/home');
      });
    } catch (error) {
      console.log(error);
    }
  }

  getUser() {
    this.appUser$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.doc<UserModel>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  signIn(email, password) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          this.isSignIn = true;
          this.router.navigateByUrl('/home');
        }
      })
      .catch(() =>
        Swal.fire('Error', 'the email or password are not valid', 'error')
      );
  }

  signUp(email, password, name) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        const NEWUSER = this.userGenerator(user, name);
        this.db.doc(`users/${user.user.uid}`).set(NEWUSER);
      })
      .catch((err) => {
        Swal.fire('Error', err.message, 'error');
      });
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  userGenerator(user, name) {
    const NEWUSER = {
      email: user.user.email,
      key: user.user.uid,
      signUpDate: new Date(),
      name,
      surname: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      img: '../../assets/img/no-img.jpg',
    };
    return NEWUSER;
  }
}
