import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ejercicio } from 'src/app/model/Ejercicio';
import { EjerciciosService } from 'src/app/services/ejercicios.service';

@Component({
  selector: 'app-ejercicio-ver',
  templateUrl: './ejercicio-ver.component.html',
  styleUrls: ['./ejercicio-ver.component.scss']
})
export class EjercicioVerComponent implements OnInit {

  ejercicio!: Ejercicio;

  constructor(
    private ejercicioService : EjerciciosService,
    private activatedRouter : ActivatedRoute
    ) {
      this.activatedRouter.params.subscribe(params => {
        this.ejercicioService.getEjercicio(params["id"]).subscribe(e => {
          this.ejercicio = e[0];
          
        });
        
      })
    }

  ngOnInit(): void {
  }


  descargar(){
    alert("Descarga...")
  }

}
