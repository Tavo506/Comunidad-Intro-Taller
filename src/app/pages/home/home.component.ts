import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import  {Ejercicio}  from 'src/app/model/Ejercicio';
import { AuthService } from 'src/app/services/auth.service';
import { EjerciciosService } from 'src/app/services/ejercicios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  filtroDificultad : number = 0;
  filtroCategoria : number = -1;
  filtroBusqueda : string = "";

  saltos : number = 10;
  pagina : number = 1;

  inicio : number = 0;
  fin : number = this.saltos;


  ejercicios : Ejercicio[] = [];
  listaInicial : Ejercicio[] = [];

  cantNiveles : number[] = [0,0,0,0,0];
  cantCategorias : number[] = [];
  categorias : string[] = [];

  constructor(
    private ejerciciosServices : EjerciciosService,
    private authServices : AuthService,
    private router : Router
  ) {
    this.ejerciciosServices.getEjercicios().subscribe(res => {
      this.listaInicial = res.reverse();
      this.ejercicios = this.listaInicial;

      this.cargarCantidades();
    })
  }

  ngOnInit(): void {
  }

  cargarCantidades(){
    var aux;

    this.ejercicios.forEach(e => {
      this.cantNiveles[e.level-1]++;

      if (this.categorias.includes(e.section)) {
        aux = this.categorias.indexOf(e.section)
        this.cantCategorias[aux]++;
      }else{
        this.categorias.push(e.section);
        this.cantCategorias.push(1);
      }

    });
    
  }

  primeraPagina(){
    this.inicio = 0;
    this.fin = this.saltos;
    this.pagina = 1;
  }

  filterDificultad(num:number){
    this.filtroDificultad = num;
    this.filtrar(this.filtroCategoria, num, this.filtroBusqueda);
    // this.ejercicios = num != 0 ? this.listaInicial.filter(e => e.level == num) : this.listaInicial;
  }

  filterCategoria(num:number){
    this.filtroCategoria = num;
    this.filtrar(num, this.filtroDificultad, this.filtroBusqueda);
    // this.ejercicios = num != -1 ? this.listaInicial.filter(e => e.section === this.categorias[num]) : this.listaInicial;
  }

  buscar(busqueda:string){
    this.filtroBusqueda = busqueda.toLowerCase();
    this.filtrar(this.filtroCategoria, this.filtroDificultad, busqueda.toLowerCase())
  }


  filtrar(categoria : number, dificultad : number, busqueda : string){
    this.primeraPagina();

    this.ejercicios = this.listaInicial.filter(e => 
      (categoria == -1 || e.section === this.categorias[categoria]) &&
      (dificultad == 0 || e.level == dificultad) &&
      (e.name.toLowerCase().includes(busqueda) || e.details.toLowerCase().includes(busqueda) || e.section.toLowerCase().includes(busqueda))
    );
  }


  siguiente(){
    if (this.fin < this.ejercicios.length) {
      this.fin += this.saltos;
      this.inicio += this.saltos;
      this.pagina++;
      window.scroll(0,0);
    } else {
      alert("No hay más resultados");
    }
  }

  anterior(){
    if (this.inicio-this.saltos > 0) {
      this.fin -= this.saltos;
      this.inicio -= this.saltos;
      this.pagina--;
    } else {
      this.primeraPagina();
    }
    window.scroll(0,0);
  }

  get cantPaginas() : number{
    return Math.ceil(this.ejercicios.length / this.saltos);
  }

  get estaAuth(){
    return this.authServices.estaAutenticado();
  }


  verEjercicio(id:any){
    this.router.navigate(["/ejercicioVer", id]);
  }
  
  editarEjercicio(id:any){    
    this.router.navigate(["/ejercicioMod", id]);
  }

}
