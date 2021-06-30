import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Especificacion } from 'src/app/model/Especificacion';
import { CodeHighlightService } from 'src/app/services/code-highlight.service';
import { EspecificacionesService } from 'src/app/services/especificaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-especificacion-ver',
  templateUrl: './especificacion-ver.component.html',
  styleUrls: ['./especificacion-ver.component.scss']
})
export class EspecificacionVerComponent implements OnInit {

  especificacion!: Especificacion;
  ejemplos: string = "";
  solucion: boolean = false;
  nuevaCalificacion: boolean = true;
  calificacion!: number;

  constructor(
    private especificacionService : EspecificacionesService,
    private highlights : CodeHighlightService,
    private activatedRouter : ActivatedRoute
    ) {
      this.activatedRouter.params.subscribe(params => {
        var aux = this.especificacionService.getEspecificacion(params["id"]).subscribe(e => {
          this.especificacion = e[0];       
           
            
        });
        
      })
    }


  get tieneArchivo(){
    return this.especificacion.fileUrl;
  }
  
  ngOnInit(): void {
  }


  async descargar(){
    if (this.especificacion.fileUrl && this.especificacion.fileName) {
      const file = await fetch(this.especificacion.fileUrl)
      const fileBlog = await file.blob()
      const fileURL = URL.createObjectURL(fileBlog)

      const link = document.createElement('a')
      link.href = fileURL
      link.download = this.especificacion.fileName;
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }



}
