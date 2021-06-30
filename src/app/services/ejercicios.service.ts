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

  
    const filePath = `${ejercicio.code}/${ejercicio.file?.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, ejercicio.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          ejercicio.fileUrl = downloadURL;
          this.ejerciciosDB.set(ejercicio.code, ejercicio)
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();

  }


  addEjercicio(ejercicio: Ejercicio) {

    return this.ejerciciosDB.set(ejercicio.code, ejercicio)

  }

  deleteEjercicio(id: string, fileName: string) {

    this.ejerciciosDB.remove(id)
      .then(() => {
        if (fileName != "") {
          this.deleteFileStorage(id, fileName);
        }
      })
      .catch(error => console.log(error));
  }

  editlvl(ejercicio : Ejercicio){
    var id = "0"
    if (ejercicio.$key) {
      id = ejercicio.$key;
    }
    delete ejercicio.$key;
    return this.ejerciciosDB.update(id, ejercicio);

  }


  editEjercicio(ejercicio : Ejercicio, id:string, eliminarFile : Boolean) {

    if (eliminarFile && ejercicio.fileName) {
      this.deleteFileStorage(id, ejercicio.fileName);
      ejercicio.fileName = "";
      ejercicio.fileUrl = "";
    }

    delete ejercicio.$key;
    return this.ejerciciosDB.update(id, ejercicio);
  }


  editEjercicioF(ejercicio : Ejercicio, id:string) {

    if (ejercicio.fileName) {
      this.deleteFileStorage(id, ejercicio.fileName);
      delete ejercicio.fileUrl;
    }
    
    ejercicio.fileName = ejercicio.file?.name;

    const filePath = `${ejercicio.code}/${ejercicio.file?.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, ejercicio.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          ejercicio.fileUrl = downloadURL;
          delete ejercicio.$key;
          this.ejerciciosDB.update(id, ejercicio);
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();

  }


  private deleteFileStorage(id: string, name: string): void {
    const storageRef = this.storage.ref(`/${id}`);
    storageRef.child(name).delete();
  }


}
