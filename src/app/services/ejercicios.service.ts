import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import Ejercicio from '../model/Ejercicio';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EjerciciosService {

  private dbPath = '/Ejercicios';
  private ejerciciosDB : AngularFireList<Ejercicio>;

  constructor(private db : AngularFireDatabase) {
    this.ejerciciosDB = this.db.list(this.dbPath, (ref) =>
      ref.orderByChild('created')
    );
  }


  getEjercicios(){
    return this.ejerciciosDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }))
      })
    )
  }

}
