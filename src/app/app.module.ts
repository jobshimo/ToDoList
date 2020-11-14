// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// FIREBASE
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from '@angular/fire/storage';

// COMPONENTS
import { AnimatedLoginComponent } from './components/animated-login/animated-login.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { SignUpComponent } from './components/auth/sign-up/sign-up.component';

// RUTAS
import { AppRoutingModule } from './app-routing.module';

// ENTORNOS
import { environment } from '../environments/environment';
import { ListasComponent } from './components/listas/listas.component';
import { ListaComponent } from './components/lista/lista.component';
import { CompletePipe } from './pipes/complete.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    AnimatedLoginComponent,
    PerfilComponent,
    ModalComponent,
    ListasComponent,
    ListaComponent,
    CompletePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    AngularFireStorageModule,
    HttpClientModule,
  ],
  providers: [AngularFireAuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
