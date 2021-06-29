import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
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
  form = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
    pass: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private auth: AuthService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
  }

  Usuario() {
    return {
      email: "",
      password: "",
      nombre: ""
    }
  }

  get nombreInvalido() {
    return this.form?.get('nombre')?.invalid && this.form?.get('nombre')?.touched;
  }

  get correoInvalido() {
    return this.form?.get('correo')?.invalid && this.form?.get('correo')?.touched;
  }

  get passInvalido() {
    return this.form?.get('pass')?.invalid && this.form?.get('pass')?.touched;
  }

  onSubmit() {

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {

        control.markAsTouched();

      })

    } else {
      this.usuario.nombre = this.form?.get('nombre')?.value;
      this.usuario.email = this.form?.get('correo')?.value;
      this.usuario.password = this.form?.get('pass')?.value;


      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor...'
      });
      Swal.showLoading();

      this.auth.nuevoUsuario( this.usuario )
        .subscribe( resp => {

          Swal.close();

          // if ( this.recordarme ) {
          //   localStorage.setItem('email', this.usuario.email);
          // }

          this.router.navigateByUrl('/home');

        }, (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: err.error.error.message
          });
        });
    }

  }
}
