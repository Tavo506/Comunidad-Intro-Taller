import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { EjerciciosService } from 'src/app/services/ejercicios.service';

import { EjercicioVerComponent } from './ejercicio-ver.component';
// import { EjercicioVerFunctions } from './ejercicio-ver-functions';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Ejercicio } from 'src/app/model/Ejercicio';



const FirestoreStub = {

  data: [{
    "00001": {
      "call": "cantidadDeDigitos (num)",
      "code": "00001",
      "created": "2021-04-03",
      "creator": "Natalia Vargas",
      "details": "Realice un programa que determine cuantos dígitos decimales tiene un número entero positivo o cero",
      "examples": [{
        "call": "cantidadDeDigitos(12345)",
        "comment": "",
        "result": "5"
      }, {
        "call": "cantidadDeDigitos(0)",
        "comment": "Cero tiene un digito",
        "result": "1"
      }, {
        "call": "cantidadDeDigitos(9)",
        "comment": "",
        "result": "1"
      }],
      "level": "1",
      "name": "Cantidad de digitos",
      "section": "Algoritmos numéricos",
      "solution": {
        "code": "def cantidadDigitos (num):\n\n    if num == 0: # El 0 es una excepción\n        return 1\n    num = abs(num) #lo hace positivo siempre\n    contador = 0\n    while num > 0:\n        contador = contador + 1\n        num = num // 10\n    return contador",
        "inputs": [{
          "name": "num",
          "type": "numero entero positivo o cero"
        }],
        "outputs": [{
          "name": "resultado",
          "type": "numero entero"
        }]
      }
    }
  }],

  getEjercicio(id: number) {
    of(this.data).subscribe(
      next => console.log('next:', next),
      err => console.log('error:', err),
      () => console.log('Completed'),
    );
  },

  editlvl(ejercicio: Ejercicio) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
};


describe('EjercicioVerComponent', () => {
  let component: EjercicioVerComponent;
  // let componentF: EjercicioVerFunctions;
  let fixture: ComponentFixture<EjercicioVerComponent>;
  // let fixtureF: ComponentFixture<EjercicioVerFunctions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EjercicioVerComponent]
    })
      .compileComponents();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: EjerciciosService,
          useValue: FirestoreStub
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: "00001" })
          }
        }
      ],
    });
  });

  // beforeEach(() => {

  //   fixtureF = TestBed.createComponent(EjercicioVerFunctions);
  //   componentF = fixtureF.componentInstance;
  //   fixtureF.detectChanges();
  // });

  beforeEach(() => {
    fixture = TestBed.createComponent(EjercicioVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ejercicio = FirestoreStub.data[0] as unknown as Ejercicio;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Prueba calc', () => {
    expect(component.calcularNivel([3])).toBe(3);
  });


  it('Prueba calc', () => {
    expect(component.calcularNivel([1, 2, 3, 4, 5])).toBe(3);
  });



  it('Prueba setNivel', () => {
    expect(component.setNivel(3)).toBe(3);
  });

});
