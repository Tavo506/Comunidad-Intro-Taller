import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Especificacion } from 'src/app/model/Especificacion';
import { CodeHighlightService } from 'src/app/services/code-highlight.service';
import { EspecificacionesService } from 'src/app/services/especificaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especificacion-mod',
  templateUrl: './especificacion-mod.component.html',
  styleUrls: ['./especificacion-mod.component.scss']
})
export class EspecificacionModComponent implements OnInit {

  especificacion!: Especificacion;
  esNuevo!: boolean;
  form!: FormGroup;
  revisado: Boolean = false;
  fileUploaded!: File;
  id!: string;

  inicioConFile! : Boolean;
  cambioFile : Boolean = false;
  primera : Boolean = true;

  categorias:string[] = [];

  newEspecificacion(): Especificacion {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return {
      code: "",
      content: "",
      created: yyyy + "-" + mm + "-" + dd,
      creator: JSON.parse(localStorage.getItem('comunidadIT_user')!).nombre,
      name: "",
      section: ""
    }
  }

  // generarForm() : FormGroup{
  //   return this.fb.group({
  //     call: [this.especificacion.call, [Validators.required]],
  //     code: [this.especificacion, [Validators.required]],
  //     created: [this.especificacion.created, [Validators.required]],
  //     creator: [this.especificacion.creator, [Validators.required]],
  //     details: [this.especificacion.details, [Validators.required]],
  //     level: [this.especificacion.level, [Validators.required]],
  //     name: [this.especificacion.name, [Validators.required]],
  //     section: [this.especificacion.section, [Validators.required]],
  //     solution: this.fb.group({
  //       code: [this.especificacion.solution.code, [Validators.required]],
  //       input: this.fb.array([
  //         this.especificacion.solution.inputs
  //       ]),
  //       outputs: 
  //     })
  //   });
  // }

  constructor(private especificacionService: EspecificacionesService,
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      code: [],
      created: [, [Validators.required]],
      creator: [, [Validators.required]],
      content: [, [Validators.required]],
      file: [],
      name: [, [Validators.required]],
      section: [, [Validators.required]],
    });

    this.especificacionService.getEspecificaciones().subscribe((res:Especificacion[]) => {
      res.forEach(e => {
        
        if (!this.categorias.includes(e.section)) {
          this.categorias.push(e.section); 
        }
  
      });
    });

    this.activatedRouter.params.subscribe(params => {
      this.setDefaults();

      if (params["id"] != "new") {
        this.esNuevo = false;
        this.id = params["id"];

        this.especificacionService.getEspecificacion(params["id"]).subscribe((e: Especificacion[]) => {
          this.especificacion = e[0];
          // this.form = this.generarForm();
          // console.log(e[0]);

          this.form.patchValue(e[0]);


          if (this.especificacion) {
            this.inicioConFile = this.especificacion.fileUrl ? true : false;
          }
          
        });

      } else {
        this.esNuevo = true;

        this.especificacion = this.newEspecificacion();
        // this.form = this.generarForm();
        this.form.patchValue(this.newEspecificacion());
      }
    });
  }

  setDefaults() {
    this.form.reset();

  }


  


  ngOnInit(): void {
  }






  // Validadores





  get nameInvalido() {
    return this.form?.get('name')?.invalid && this.form?.get('name')?.touched;
  }

  get sectionInvalido() {
    return this.form?.get('section')?.invalid && this.form?.get('section')?.touched;
  }

  get codeInvalido() {
    return this.form?.get('solution.code')?.invalid && this.form?.get('solution.code')?.touched;
  }
  
  get contenidoInvalido() {
    return this.form?.get('content')?.invalid && this.form?.get('content')?.touched;
  }


  selectFile(event: any) {
    this.fileUploaded = event.target.files.item(0);
    this.cambioFile = true;
  }


  resetFile(valor : any){
    this.fileUploaded = valor;
  }


  eliminar() {
    if (!this.esNuevo) {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'question',
        text: '¿Eliminar Especificacion?',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.especificacionService.deleteEspecificacion(this.id, this.especificacion.fileName ? this.especificacion.fileName : "");
          this.router.navigate(["/homeEspecificaciones"]);
          Swal.fire(
            '¡Especificacion eliminada!'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      })
    }else{
      this.router.navigate(["/homeEspecificaciones"]);
    }
  }


  onSubmit() {
    this.revisado = true;

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {

        control.markAsTouched();

      })
      return;
    }



    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();



    this.especificacion.name = this.form.get("name")?.value;
    this.especificacion.section = this.form.get("section")?.value;
    this.especificacion.content = this.form.get("content")?.value;




    if (this.esNuevo) { // Si el especificacion es nuevo
      this.especificacion.creator = this.form.get("creator")?.value;


      var codigo;
      var aux = this.especificacionService.getNewCode().subscribe(res => {
        codigo = "00000" + (+res + 1);
        codigo = codigo.slice(-5);
        this.especificacion.code = codigo;
        aux.unsubscribe();


      if (this.fileUploaded) {  //  Si el especificacion tiene archivo adjunto

        this.especificacion.file = this.fileUploaded;
        this.especificacion.fileName = this.fileUploaded.name;

        this.especificacionService.addEspecificacionF(this.especificacion)
          .subscribe(resp => {
            
            if (resp == 100) {
              Swal.fire("¡Especificacion creado!");
              this.router.navigateByUrl('/homeEspecificaciones');
            }

          }, (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear la especificacion',
              text: err.error.error.message
            });
          });

      } else {  // Si el especificacion no tiene archivo adjunto

        this.especificacionService.addEspecificacion(this.especificacion)
          .then((resp: any) => {

            Swal.fire("¡Especificacion creado!");
            this.router.navigateByUrl('/homeEspecificaciones');

          }, (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear la especificacion',
              text: err.error.error.message
            });
          });
      }
    });


    } else {  // Si el especificacion no es nuevo (modificar)

      this.especificacion.name = this.form.get("name")?.value;
      this.especificacion.section = this.form.get("section")?.value;
  


      if (this.fileUploaded) {  // Si tiene un archivo para modificar
        this.especificacion.file = this.fileUploaded;

        this.especificacionService.editEspecificacionF(this.especificacion, this.id)
        .subscribe(resp => {
            
          if (resp == 100) {
            Swal.fire("¡Modificación exitosa!");
            this.router.navigateByUrl('/homeEspecificaciones');
          }

        }, (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al editar la especificacion',
            text: err.error.error.message
          });
        });

      }else{  // Si no hay archivo para subir / modificar

        this.especificacionService.editEspecificacion(this.especificacion, this.id, this.cambioFile)
          .then(res => {
            Swal.fire("¡Modificación exitosa!")
            this.router.navigateByUrl('/homeEspecificaciones');
          }, (err) =>{
            Swal.fire({
              icon: 'error',
              title: 'Error al editar la especificacion',
              text: err.error.error.message
            });
          })

      }


    }
  }

}
