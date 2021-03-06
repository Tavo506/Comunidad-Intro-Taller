import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { EjercicioModComponent } from './pages/ejercicio-mod/ejercicio-mod.component';
import { EjercicioVerComponent } from './pages/ejercicio-ver/ejercicio-ver.component';
import { EspecificacionModComponent } from './pages/especificacion-mod/especificacion-mod.component';
import { EspecificacionVerComponent } from './pages/especificacion-ver/especificacion-ver.component';
import { HomeEspecificacionesComponent } from './pages/home-especificaciones/home-especificaciones.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {
    path : "home", component:HomeComponent
  },
  {
    path : "homeEspecificaciones", component:HomeEspecificacionesComponent
  },
  {
    path : "login", component:LoginComponent
  },
  {
    path : "register", component:RegisterComponent
  },
  {
    path : "ejercicioVer/:id", component:EjercicioVerComponent
  },
  {
    path : "ejercicioMod/:id", component:EjercicioModComponent, canActivate:[AuthGuard]
  },
  {
    path : "especificacionVer/:id", component:EspecificacionVerComponent
  },
  {
    path : "especificacionMod/:id", component:EspecificacionModComponent, canActivate:[AuthGuard]
  },
  {
    path : "**", redirectTo : "home"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
