import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/Usuario';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  usuario: Usuario = this.Usuario();
  recordarme = false;

  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {
  }

  Usuario(){
    return {
      email : "",
      password : "",
      nombre : ""
    }
  }

  onSubmit( form: NgForm ) {

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
    Swal.close();

    // this.auth.nuevoUsuario( this.usuario )
    //   .subscribe( resp => {

    //     console.log(resp);
    //     Swal.close();

    //     if ( this.recordarme ) {
    //       localStorage.setItem('email', this.usuario.email);
    //     }

    //     this.router.navigateByUrl('/home');

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
