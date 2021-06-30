import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Ejercicio } from '../model/Ejercicio';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class EjerciciosService {

  private dbPath = '/Ejercicios';
  private ejerciciosDB: AngularFireList<Ejercicio>;

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) {
    this.ejerciciosDB = this.db.list(this.dbPath, (ref) =>
      ref.orderByChild('code')
    );
  }


  getEjercicios(): Observable<any[]> {
    return this.ejerciciosDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }


  getEjercicio(id: string): Observable<any[]> {
    return this.ejerciciosDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        })).filter(e => e.$key == id);
      })
    );
  }


  getNewCode(): Observable<any> {
    return this.ejerciciosDB.snapshotChanges().pipe(
      map((changes) => {
        if (changes.length == 0) {
          return "0"
        }
        return changes[changes.length - 1].payload.key;
      })
    );
  }


  addEjercicioF(ejercicio: Ejercicio): Observable<any> {

    var codigo!: string;

    var aux = this.getNewCode().subscribe(res => {
      codigo = "00000" + (+res + 1);
      codigo = codigo.slice(-5);
      ejercicio.code = codigo;
      aux.unsubscribe();


      const filePath = `${codigo}/${ejercicio.file?.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, ejercicio.file);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            ejercicio.fileUrl = downloadURL;
            this.ejerciciosDB.set(codigo, ejercicio)
          });
        })
      ).subscribe();
      return uploadTask.percentageChanges();

    });
    return new Observable;
  }


  addEjercicio(ejercicio: Ejercicio) {

    return this.ejerciciosDB.set(ejercicio.code, ejercicio)

  }

  deleteEjercicio(id: string) {
    //? Que base de datos afectaremos? Jugadores.
    //? El id del jugador que deseamos eliminar.
    this.ejerciciosDB.remove(id);
  }
}
