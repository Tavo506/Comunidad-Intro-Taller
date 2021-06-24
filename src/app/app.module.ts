import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';


// Highlights
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';


// Components
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { EjercicioVerComponent } from './pages/ejercicio-ver/ejercicio-ver.component';
import { EjercicioModComponent } from './pages/ejercicio-mod/ejercicio-mod.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { EjerciciosService } from './services/ejercicios.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    EjercicioVerComponent,
    EjercicioModComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    HighlightModule
  ],
  providers: [EjerciciosService, 
    {
    provide: HIGHLIGHT_OPTIONS,
    useValue: {
      fullLibraryLoader: () => import('highlight.js'),
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
