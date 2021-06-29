import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Ejercicio } from 'src/app/model/Ejercicio';
import { CodeHighlightService } from 'src/app/services/code-highlight.service';
import { EjerciciosService } from 'src/app/services/ejercicios.service';

@Component({
  selector: 'app-ejercicio-mod',
  templateUrl: './ejercicio-mod.component.html',
  styleUrls: ['./ejercicio-mod.component.scss']
})
export class EjercicioModComponent implements OnInit {

  ejercicio!: Ejercicio;
  esNuevo!: boolean;
  form! : FormGroup;

  newEjercicio(): Ejercicio {
    return {
      call : "",
      code : "",
      created : new Date(),
      creator : "",
      details : "",
      examples : [],
      level : 1,
      name: "",
      section : "",
      solution : {
        code : "",
        inputs : [],
        outputs : []
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
    private highlights: CodeHighlightService,
    private activatedRouter: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      call: [, [Validators.required]],
      code: [, [Validators.required]],
      created: [, [Validators.required]],
      creator: [, [Validators.required]],
      details: [, [Validators.required]],
      examples: this.fb.array([
        this.fb.control({})
      ]),
      level: [, [Validators.required]],
      name: [, [Validators.required]],
      section: [, [Validators.required]],
      solution: this.fb.group({
        code: [, [Validators.required]],
        inputs: this.fb.array([
          this.fb.control({})
        ]),
        outputs: this.fb.array([
          this.fb.control({})
        ])
      })
    });

    this.activatedRouter.params.subscribe(params => {
      if (params["id"] != "new") {
        this.esNuevo = false;

        this.ejercicioService.getEjercicio(params["id"]).subscribe((e:Ejercicio[]) => {
          this.ejercicio = e[0];
          // this.form = this.generarForm();
          // console.log(e[0]);
          
          this.form.patchValue(e[0]);
        });

      } else {
        this.esNuevo = true;

        this.ejercicio = this.newEjercicio();
        // this.form = this.generarForm();
        this.form.patchValue(this.newEjercicio());
      }
    });
  }


  ngOnInit(): void {
  }


  get nivel(){
    return this.form.get("level")?.value;
  }

  setNivel(lvl:number){
    if (this.esNuevo) {
      this.form.get('level')?.setValue(lvl);
    }
    
  }


  onSubmit(){
    console.log(this.form);
    
  }


}
