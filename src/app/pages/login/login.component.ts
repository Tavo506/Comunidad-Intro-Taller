import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
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
  form = this.fb.group({
    correo: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    pass: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor( private auth: AuthService,
               private router: Router,
               private fb: FormBuilder ) {}

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

  login(  ) {
    // si el form está ok
    // if (  this.form.invalid ) { return; }

    this.usuario.email = this.form?.get('correo')?.value;
    this.usuario.password = this.form?.get('pass')?.value;

    //alert de loading
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    //hace el login con el servicio
    this.auth.login( this.usuario )
      .subscribe( resp => {
        Swal.close();

        // if ( this.recordarme ) {
        //   localStorage.setItem('email', this.usuario.email);
        // }
        this.router.navigateByUrl('/home');
        // si da error
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
      });

  }

}
