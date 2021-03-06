import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { AngularFireStorageModule } from '@angular/fire/storage';

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
import { AuthService } from './services/auth.service';
import { HomeEspecificacionesComponent } from './pages/home-especificaciones/home-especificaciones.component';
import { EspecificacionVerComponent } from './pages/especificacion-ver/especificacion-ver.component';
import { EspecificacionModComponent } from './pages/especificacion-mod/especificacion-mod.component';
import { EspecificacionesService } from './services/especificaciones.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    EjercicioVerComponent,
    EjercicioModComponent,
    NavbarComponent,
    HomeEspecificacionesComponent,
    EspecificacionVerComponent,
    EspecificacionModComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    HighlightModule,
    HttpClientModule,
    AngularFireStorageModule
  ],
  providers: [EjerciciosService, AuthService, EspecificacionesService,
    {
    provide: HIGHLIGHT_OPTIONS,
    useValue: {
      fullLibraryLoader: () => import('highlight.js'),
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
