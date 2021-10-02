import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ejercicio } from 'src/app/model/Ejercicio';
import { CodeHighlightService } from 'src/app/services/code-highlight.service';
import { EjerciciosService } from 'src/app/services/ejercicios.service';
import Swal from 'sweetalert2';
// import { EjercicioVerFunctions } from "src/app/pages/ejercicio-ver/ejercicio-ver-functions";

@Component({
  selector: 'app-ejercicio-ver',
  templateUrl: './ejercicio-ver.component.html',
  styleUrls: ['./ejercicio-ver.component.scss'],

})
export class EjercicioVerComponent implements OnInit {

  ejercicio!: Ejercicio;
  ejemplos: string = "";
  solucion: boolean = false;
  nuevaCalificacion: boolean = true;
  calificacion: number = 1;

  constructor(
    private ejercicioService: EjerciciosService,
    private highlights: CodeHighlightService,
    private activatedRouter: ActivatedRoute,
    // private funcions: EjercicioVerFunctions
  ) {
    this.activatedRouter.params.subscribe(params => {
      var aux = this.ejercicioService.getEjercicio(params["id"]).subscribe(e => {
        this.ejercicio = e[0];

        if (this.ejercicio) {



          this.calificacion = this.ejercicio.level;

          this.ejercicio.examples.forEach((e, i) => {
            this.ejemplos += `${e.call} == ${e.result}\n`;
            if (e.comment != "") {
              this.ejemplos += `${e.comment}\n`;
            }
            if (i < this.ejercicio.examples.length - 1) {
              this.ejemplos += "\n";
            }

          })

          setTimeout(() => {
            this.highlights.renderCode();

          }, 1);

        }

      });

    })
  }


  get tieneArchivo() {
    return this.ejercicio.fileUrl;
  }

  ngOnInit(): void {
  }


  async descargar() {
    if (this.ejercicio.fileUrl && this.ejercicio.fileName) {
      const file = await fetch(this.ejercicio.fileUrl)
      const fileBlog = await file.blob()
      const fileURL = URL.createObjectURL(fileBlog)

      const link = document.createElement('a')
      link.href = fileURL
      link.download = this.ejercicio.fileName;
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  //calc nivel
  calcularNivel(ratings: number[]){
    return Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
  }

  //guarda nivel
  guardarNivel(ejercicio:Ejercicio){
    this.ejercicioService.editlvl(ejercicio)
    .then(() => {
      console.log("¡Calificación realizada!");
    });
  }

  //controlador de set nivel
  setNivel(lvl: number) {
    var nivel = -1;
    if (this.nuevaCalificacion) {

      this.nuevaCalificacion = false;
      this.calificacion = lvl;

      if (this.ejercicio.ratings) {
        this.ejercicio.ratings.push(lvl);
      } else {
        this.ejercicio.ratings = [lvl];
      }

      nivel = this.calcularNivel(this.ejercicio.ratings);
      this.ejercicio.level = nivel;

      this.guardarNivel(this.ejercicio);
    }
    return nivel;
  }



  mostrarSolucion() {
    this.solucion = !this.solucion;

    setTimeout(() => {
      this.highlights.renderCode();
    }, 1);


  }


}
