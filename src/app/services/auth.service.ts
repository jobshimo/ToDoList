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

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  isSignIn: boolean;
  appUser$: Observable<UserModel>;
  user:UserModel;
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
      });
  }

  signUp(email, password, name) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        const NEWUSER = this.userGenerator(user, name);

        this.db.doc(`users/${user.user.uid}`).set(NEWUSER);
      });
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  //FUNCTIONS:
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
      img:
        'https://firebasestorage.googleapis.com/v0/b/idolosapp.appspot.com/o/no-img.jpg?alt=media&token=bee221ed-9ac9-45aa-a09e-4302ca326e21',
    };
    return NEWUSER;
  }
}
