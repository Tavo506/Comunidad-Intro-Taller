import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ejercicio } from 'src/app/model/Ejercicio';
import { CodeHighlightService } from 'src/app/services/code-highlight.service';
import { EjerciciosService } from 'src/app/services/ejercicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ejercicio-mod',
  templateUrl: './ejercicio-mod.component.html',
  styleUrls: ['./ejercicio-mod.component.scss']
})
export class EjercicioModComponent implements OnInit {

  ejercicio!: Ejercicio;
  esNuevo!: boolean;
  form!: FormGroup;
  revisado: Boolean = false;
  fileUploaded!: File;
  id!: string;

  newEjercicio(): Ejercicio {
    var today = new Date();
    var dd = String(today.getDate() + 1).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return {
      call: "",
      code: "",
      created: yyyy + "-" + mm + "-" + dd,
      creator: JSON.parse(localStorage.getItem('comunidadIT_user')!).nombre,
      details: "",
      examples: [],
      level: 1,
      name: "",
      section: "",
      solution: {
        code: "",
        inputs: [],
        outputs: []
      },
    }
  }

  // generarForm() : FormGroup{
  //   return this.fb.group({
  //     call: [this.ejercicio.call, [Validators.required]],
  //     code: [this.ejercicio, [Validators.required]],
  //     created: [this.ejercicio.created, [Validators.required]],
  //     creator: [this.ejercicio.creator, [Validators.required]],
  //     details: [this.ejercicio.details, [Validators.required]],
  //     level: [this.ejercicio.level, [Validators.required]],
  //     name: [this.ejercicio.name, [Validators.required]],
  //     section: [this.ejercicio.section, [Validators.required]],
  //     solution: this.fb.group({
  //       code: [this.ejercicio.solution.code, [Validators.required]],
  //       input: this.fb.array([
  //         this.ejercicio.solution.inputs
  //       ]),
  //       outputs: 
  //     })
  //   });
  // }

  constructor(private ejercicioService: EjerciciosService,
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      call: [, [Validators.required]],
      code: [],
      created: [, [Validators.required]],
      creator: [, [Validators.required]],
      details: [, [Validators.required]],
      examples: this.fb.array([]),
      file: [],
      level: [, [Validators.required]],
      name: [, [Validators.required]],
      section: [, [Validators.required]],
      solution: this.fb.group({
        code: [, [Validators.required]],
        inputs: this.fb.array([]),
        outputs: this.fb.array([])
      })
    });

    this.activatedRouter.params.subscribe(params => {
      this.setDefaults();

      if (params["id"] != "new") {
        this.esNuevo = false;
        this.id = params["id"];

        this.ejercicioService.getEjercicio(params["id"]).subscribe((e: Ejercicio[]) => {
          this.ejercicio = e[0];
          // this.form = this.generarForm();
          // console.log(e[0]);

          this.form.patchValue(e[0]);
          this.cargarListas(e[0]);
        });

      } else {
        this.esNuevo = true;

        this.ejercicio = this.newEjercicio();
        // this.form = this.generarForm();
        this.form.patchValue(this.newEjercicio());
      }
    });
  }

  setDefaults() {
    this.form.reset();


    this.form.setControl('examples', new FormArray([]));
    (this.form.get('solution') as FormGroup).setControl('inputs', new FormArray([]));
    (this.form.get('solution') as FormGroup).setControl('outputs', new FormArray([]));
  }


  cargarListas(ejercicio: Ejercicio) {
    ejercicio.examples.forEach(valor => this.examples.push(this.fb.group(
      {
        call: [valor.call, [Validators.required]],
        result: [valor.result, [Validators.required]],
        comment: [valor.comment]
      }
    )));
    ejercicio.solution.inputs?.forEach(valor => (this.form.get('solution.inputs') as FormArray).push(this.fb.group(valor)));
    ejercicio.solution.outputs.forEach(valor => (this.form.get('solution.outputs') as FormArray).push(this.fb.group(valor)));
  }


  ngOnInit(): void {
  }

  get examples() {
    // console.log((this.form.get('examples') as FormArray).controls[0].value.call);

    return this.form.get('examples') as FormArray;
  }

  get inputs() {
    // console.log(this.form.get('solution.inputs') as FormArray);

    return this.form.get('solution.inputs') as FormArray;
  }

  get outputs() {
    return this.form.get('solution.outputs') as FormArray;
  }


  agregarExample() {
    this.examples.push(this.fb.group({
      call: ["", Validators.required],
      result: ["", Validators.required],
      comment: ""
    }));
  }

  borrarExample(i: number) {
    this.examples.removeAt(i);
  }


  agregarInput() {
    (this.form.get("solution.inputs") as FormArray).push(this.fb.group({
      name: ["", Validators.required],
      type: ["", Validators.required]
    }));
  }

  borrarInput(i: number) {
    (this.form.get("solution.inputs") as FormArray).removeAt(i);
  }


  agregarOutput() {
    (this.form.get("solution.outputs") as FormArray).push(this.fb.group({
      name: ["", Validators.required],
      type: ["", Validators.required]
    }));
  }

  borrarOutput(i: number) {
    (this.form.get("solution.outputs") as FormArray).removeAt(i);
  }



  get nivel() {
    return this.form.get("level")?.value;
  }

  setNivel(lvl: number) {
    if (this.esNuevo) {
      this.form.get('level')?.setValue(lvl);
    }
  }




  // Validadores

  get callInvalido() {
    return this.form?.get('call')?.invalid && this.form?.get('call')?.touched;
  }

  get detailsInvalido() {
    return this.form?.get('details')?.invalid && this.form?.get('details')?.touched;
  }

  get nameInvalido() {
    return this.form?.get('name')?.invalid && this.form?.get('name')?.touched;
  }

  get sectionInvalido() {
    return this.form?.get('section')?.invalid && this.form?.get('section')?.touched;
  }

  get codeInvalido() {
    return this.form?.get('solution.code')?.invalid && this.form?.get('solution.code')?.touched;
  }

  get sinEjemplos() {
    return this.examples.controls.length == 0;
  }

  get sinSalidas() {
    return (this.form.get("solution.outputs") as FormArray).controls.length == 0;
  }


  exampleCallInvalido(num: number): Boolean {
    return (this.examples.controls[num] as FormGroup).controls.call.invalid &&
      (this.examples.controls[num] as FormGroup).controls.call.touched;
  }

  exampleResultInvalido(num: number): Boolean {
    return (this.examples.controls[num] as FormGroup).controls.result.invalid &&
      (this.examples.controls[num] as FormGroup).controls.result.touched;
  }

  inputNameInvalido(num: number): Boolean {
    return ((this.form.get("solution.inputs") as FormArray).controls[num] as FormGroup).controls.name.invalid &&
      ((this.form.get("solution.inputs") as FormArray).controls[num] as FormGroup).controls.name.touched;
  }

  inputTypeInvalido(num: number): Boolean {
    return ((this.form.get("solution.inputs") as FormArray).controls[num] as FormGroup).controls.type.invalid &&
      ((this.form.get("solution.inputs") as FormArray).controls[num] as FormGroup).controls.type.touched;
  }

  outputNameInvalido(num: number): Boolean {
    return ((this.form.get("solution.outputs") as FormArray).controls[num] as FormGroup).controls.name.invalid &&
      ((this.form.get("solution.outputs") as FormArray).controls[num] as FormGroup).controls.name.touched;
  }

  outputTypeInvalido(num: number): Boolean {
    return ((this.form.get("solution.outputs") as FormArray).controls[num] as FormGroup).controls.type.invalid &&
      ((this.form.get("solution.outputs") as FormArray).controls[num] as FormGroup).controls.type.touched;
  }


  // Fin validadores


  selectFile(event: any) {
    this.fileUploaded = event.target.files.item(0);

  }


  eliminar() {
    if (!this.esNuevo) {
      Swal.fire({
        allowOutsideClick: false,
        icon: 'question',
        text: '¿Eliminar Ejercicio?',
        showCancelButton: true,
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.ejercicioService.deleteEjercicio(this.id);
          this.router.navigate(["/home"]);
          Swal.fire(
            '¡Ejercicio eliminado!'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      })
    }else{
      this.router.navigate(["/home"]);
    }
  }


  onSubmit() {
    this.revisado = true;

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {

        if (control instanceof FormGroup) { // solution
          Object.values(control.controls).forEach(innerControl => {

            if (innerControl instanceof FormArray) {  // inputs and outputs
              Object.values(innerControl.controls).forEach(innerInnerControl => {
                innerInnerControl.markAllAsTouched();
              });

            } else {
              innerControl.markAllAsTouched();  // code
            }
          })

        } else if (control instanceof FormArray) {  // examples
          Object.values(control.controls).forEach(innerControl => {
            innerControl.markAllAsTouched();
          });

        } else {
          control.markAsTouched();
        }

      })
      return;
    }



    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();



    this.ejercicio.call = this.form.get("call")?.value;
    this.ejercicio.created = this.form.get("created")?.value;
    this.ejercicio.details = this.form.get("details")?.value;
    this.ejercicio.name = this.form.get("name")?.value;
    this.ejercicio.section = this.form.get("section")?.value;

    this.ejercicio.examples = this.form.get("examples")?.value;
    this.ejercicio.solution = this.form.get("solution")?.value;



    if (this.esNuevo) {
      this.ejercicio.creator = this.form.get("creator")?.value;
      this.ejercicio.level = this.form.get("level")?.value;
      console.log(this.ejercicio);

      var codigo;
      var aux = this.ejercicioService.getNewCode().subscribe(res => {
        codigo = "00000" + (+res + 1);
        codigo = codigo.slice(-5);
        this.ejercicio.code = codigo;
        aux.unsubscribe();


      if (this.fileUploaded) {
        this.ejercicio.file = this.fileUploaded;

        this.ejercicioService.addEjercicioF(this.ejercicio)
          .subscribe(resp => {

            if (resp == 100) {
              Swal.close();
              this.router.navigateByUrl('/home');
            }

          }, (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear el ejercicio',
              text: err.error.error.message
            });
          });

      } else {
        this.ejercicioService.addEjercicio(this.ejercicio)
          .then((resp: any) => {

            Swal.close();
            this.router.navigateByUrl('/home');

          }, (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al crear el ejercicio',
              text: err.error.error.message
            });
          });
      }
    });

    } else {

    }
  }

}
