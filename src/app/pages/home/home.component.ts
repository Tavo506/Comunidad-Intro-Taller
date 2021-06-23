import { Component, OnInit } from '@angular/core';
import  {Ejercicio}  from 'src/app/model/Ejercicio';
import { EjerciciosService } from 'src/app/services/ejercicios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dificultad : number = 0;
  categoria : number = 0;

  inicio : number = 0;
  fin : number = 10;

  saltos : number = 10;
  pagina : number = 1;

  ejercicios : Ejercicio[] = [];

  constructor(
    private ejerciciosServices : EjerciciosService
  ) {
    this.ejerciciosServices.getEjercicios().subscribe(res => {
      this.ejercicios = res;
    })
  }

  ngOnInit(): void {
  }

  filterDificultad(num:number){
    this.dificultad = num;
  }

  filterCategoria(categoria:string, num:number){
    this.categoria = num;
  }

  siguiente(){
    if (this.fin < this.ejercicios.length) {
      this.fin += this.saltos;
      this.inicio += this.saltos;
      this.pagina++;
    } else {
      alert("No hay más resultados");
    }
  }

  anterior(){
    if (this.inicio > 0) {
      this.fin -= this.saltos;
      this.inicio -= this.saltos;
      this.pagina--;
    } else {
      this.inicio = 0;
      this.fin = this.saltos;
      this.pagina = 1;
    }
  }

  get cantPaginas() : number{
    return Math.ceil(this.ejercicios.length / this.saltos);
  }

}
