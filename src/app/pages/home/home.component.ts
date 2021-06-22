import { Component, OnInit } from '@angular/core';
import Ejercicio from 'src/app/model/Ejercicio';
import { EjerciciosService } from 'src/app/services/ejercicios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dificultad : number = 0;
  categoria : number = 0;

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

}
