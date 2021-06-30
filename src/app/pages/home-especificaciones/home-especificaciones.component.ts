import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Especificacion } from 'src/app/model/Especificacion';
import { AuthService } from 'src/app/services/auth.service';
import { EspecificacionesService } from 'src/app/services/especificaciones.service';

@Component({
  selector: 'app-home-especificaciones',
  templateUrl: './home-especificaciones.component.html',
  styleUrls: ['./home-especificaciones.component.scss']
})
export class HomeEspecificacionesComponent implements OnInit {

  filtroDificultad: number = 0;
  filtroCategoria: number = -1;
  filtroBusqueda: string = "";

  saltos: number = 10;
  pagina: number = 1;

  inicio: number = 0;
  fin: number = this.saltos;


  especificaciones: Especificacion[] = [];
  listaInicial: Especificacion[] = [];

  cantCategorias: number[] = [];
  categorias: string[] = [];

  constructor(
    private especificacionesServices: EspecificacionesService,
    private authServices: AuthService,
    private router: Router
  ) {
    this.especificacionesServices.getEspecificaciones().subscribe(res => {
      this.listaInicial = res.sort(function (a, b) {
        // Para que el ordenamiento funcione se quitan las tíldes
        var x = a["name"].normalize("NFD").replace(/[\u0300-\u036f]/g, ""); var y = b["name"].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });

      this.especificaciones = this.listaInicial;

      this.cargarCantidades();
    })
  }

  ngOnInit(): void {
  }

  cargarCantidades() {
    var aux;

    this.especificaciones.forEach(e => {

      if (this.categorias.includes(e.section)) {
        aux = this.categorias.indexOf(e.section)
        this.cantCategorias[aux]++;
      } else {
        this.categorias.push(e.section);
        this.cantCategorias.push(1);
      }

    });

  }

  primeraPagina() {
    this.inicio = 0;
    this.fin = this.saltos;
    this.pagina = 1;
  }



  filterCategoria(num: number) {
    this.filtroCategoria = num;
    this.filtrar(num, this.filtroBusqueda);
    // this.especificaciones = num != -1 ? this.listaInicial.filter(e => e.section === this.categorias[num]) : this.listaInicial;
  }

  buscar(busqueda: string) {
    this.filtroBusqueda = busqueda.toLowerCase();
    this.filtrar(this.filtroCategoria, busqueda.toLowerCase())
  }


  filtrar(categoria: number, busqueda: string) {
    this.primeraPagina();

    this.especificaciones = this.listaInicial.filter(e =>
      (categoria == -1 || e.section === this.categorias[categoria]) &&
      (e.name.toLowerCase().includes(busqueda) || e.section.toLowerCase().includes(busqueda))
    );
  }


  siguiente() {
    if (this.fin < this.especificaciones.length) {
      this.fin += this.saltos;
      this.inicio += this.saltos;
      this.pagina++;
      window.scroll(0, 0);
    } else {
      alert("No hay más resultados");
    }
  }

  anterior() {
    if (this.inicio - this.saltos > 0) {
      this.fin -= this.saltos;
      this.inicio -= this.saltos;
      this.pagina--;
    } else {
      this.primeraPagina();
    }
    window.scroll(0, 0);
  }

  get cantPaginas(): number {
    return Math.ceil(this.especificaciones.length / this.saltos);
  }

  get estaAuth() {
    return this.authServices.estaAutenticado();
  }


  verEspecificacion(id: any) {
    this.router.navigate(["/especificacionVer", id]);
  }

  editarEspecificacion(id: any) {
    this.router.navigate(["/especificacionMod", id]);
  }

}
