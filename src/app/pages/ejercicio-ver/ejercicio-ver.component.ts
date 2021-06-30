import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ejercicio } from 'src/app/model/Ejercicio';
import { CodeHighlightService } from 'src/app/services/code-highlight.service';
import { EjerciciosService } from 'src/app/services/ejercicios.service';

@Component({
  selector: 'app-ejercicio-ver',
  templateUrl: './ejercicio-ver.component.html',
  styleUrls: ['./ejercicio-ver.component.scss'],
  
})
export class EjercicioVerComponent implements OnInit {

  ejercicio!: Ejercicio;
  ejemplos: string = "";
  solucion: boolean = false;

  constructor(
    private ejercicioService : EjerciciosService,
    private highlights : CodeHighlightService,
    private activatedRouter : ActivatedRoute
    ) {
      this.activatedRouter.params.subscribe(params => {
        this.ejercicioService.getEjercicio(params["id"]).subscribe(e => {
          this.ejercicio = e[0];

          this.ejercicio.examples.forEach((e, i) => {
            this.ejemplos += `${e.call} == ${e.result}\n`;
            if (e.comment != "") {
              this.ejemplos += `${e.comment}\n`;
            }
            if (i < this.ejercicio.examples.length-1) {
              this.ejemplos += "\n";
            }
              
          })

          setTimeout(() => {
            this.highlights.renderCode();
            
          }, 1);
          
           
            
        });
        
      })
    }


  get tieneArchivo(){
    return this.ejercicio.file;
  }
  
  ngOnInit(): void {
  }


  descargar(){
    alert("Descarga...")
  }


  mostrarSolucion(){
    this.solucion = !this.solucion;
      
    setTimeout(() => {
      this.highlights.renderCode();
    }, 1);
  

  }


}
