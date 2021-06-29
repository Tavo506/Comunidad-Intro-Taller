import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import  {Ejercicio}  from '../model/Ejercicio';

@Injectable({
  providedIn: 'root'
})
export class EjerciciosService {

  private dbPath = '/Ejercicios';
  private ejerciciosDB : AngularFireList<Ejercicio>;

  constructor(private db : AngularFireDatabase) {
    this.ejerciciosDB = this.db.list(this.dbPath, (ref) =>
      ref.orderByChild('code')
    );
  }


  getEjercicios() : Observable<any[]>{
    return this.ejerciciosDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }


  getEjercicio(id:string) : Observable<any[]>{
    return this.ejerciciosDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        })).filter(e => e.$key == id);
      })
    );
  }


  getNewCode() : Observable<any>{
    return this.ejerciciosDB.snapshotChanges().pipe(
      map((changes) => {
        if (changes.length == 0) {
          return "0"
        }
        return changes[changes.length-1].payload.key;
      })
    );
  }


  addEjercicio(ejercicio : Ejercicio){
    var codigo;
    this.getNewCode().subscribe(res => {
      codigo = "00000" + (+res + 1);
      codigo = codigo.slice(-5);
      
      ejercicio.code = codigo;
      // return this.ejerciciosDB.set(codigo, ejercicio)
    });
    
  }


}
