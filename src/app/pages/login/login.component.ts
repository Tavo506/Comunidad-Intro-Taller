import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //Model usuario
  //Model usuario
  usuario: Usuario = this.Usuario();
  recordarme: boolean = false;

  constructor( private auth: AuthService,
               private router: Router ) {}

  ngOnInit() {
    // en el LS hay un email
    if ( localStorage.getItem('email') ) {
      this.recordarme = true;
    }

  }

  Usuario(){
    return {
      email : "",
      password : "",
      nombre : ""
    }
  }

  login( form: NgForm ) {
    // si el form está ok
    if (  form.invalid ) { return; }

    //alert de loading
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    setTimeout(() => {
      Swal.close();
    }, 500);

    // //hace el login con el servicio
    // this.auth.login( this.usuario )
    //   .subscribe( resp => {
    //     console.log(resp);
    //     Swal.close();

    //     if ( this.recordarme ) {
    //       localStorage.setItem('email', this.usuario.email);
    //     }
    //     this.router.navigateByUrl('/home');
    //     // si da error
    //   }, (err) => {
    //     console.log(err.error.error.message);
    //     Swal.fire({
    //       type: 'error',
    //       title: 'Error al autenticar',
    //       text: err.error.error.message
    //     });
    //   });

  }

}
