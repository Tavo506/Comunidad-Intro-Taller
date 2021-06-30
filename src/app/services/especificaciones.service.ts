import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { Especificacion } from '../model/Especificacion';

@Injectable({
  providedIn: 'root'
})
export class EspecificacionesService {

  private dbPath = '/Especificaciones';
  private especificacionesDB: AngularFireList<Especificacion>;

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) {
    this.especificacionesDB = this.db.list(this.dbPath, (ref) =>
      ref.orderByChild('code')
    );
  }


  getEspecificaciones(): Observable<any[]> {
    return this.especificacionesDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        }));
      })
    );
  }


  getEspecificacion(id: string): Observable<any[]> {
    return this.especificacionesDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        })).filter(e => e.$key == id);
      })
    );
  }


  getNewCode(): Observable<any> {
    return this.especificacionesDB.snapshotChanges().pipe(
      map((changes) => {
        if (changes.length == 0) {
          return "0"
        }
        return changes[changes.length - 1].payload.key;
      })
    );
  }
  


  addEspecificacionF(especificacion: Especificacion): Observable<any> {

  
    const filePath = `${this.dbPath}/${especificacion.code}/${especificacion.file?.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, especificacion.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          especificacion.fileUrl = downloadURL;
          this.especificacionesDB.set(especificacion.code, especificacion)
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();

  }


  addEspecificacion(especificacion: Especificacion) {

    return this.especificacionesDB.set(especificacion.code, especificacion)

  }

  deleteEspecificacion(id: string, fileName: string) {

    this.especificacionesDB.remove(id)
      .then(() => {
        if (fileName != "") {
          this.deleteFileStorage(id, fileName);
        }
      })
      .catch(error => console.log(error));
  }

  editlvl(especificacion : Especificacion){
    var id = "0"
    if (especificacion.$key) {
      id = especificacion.$key;
    }
    delete especificacion.$key;
    return this.especificacionesDB.update(id, especificacion);

  }


  editEspecificacion(especificacion : Especificacion, id:string, eliminarFile : Boolean) {

    if (eliminarFile && especificacion.fileName) {
      this.deleteFileStorage(id, especificacion.fileName);
      especificacion.fileName = "";
      especificacion.fileUrl = "";
    }

    delete especificacion.$key;
    return this.especificacionesDB.update(id, especificacion);
  }


  editEspecificacionF(especificacion : Especificacion, id:string) {

    if (especificacion.fileName) {
      this.deleteFileStorage(id, especificacion.fileName);
      delete especificacion.fileUrl;
    }
    
    especificacion.fileName = especificacion.file?.name;

    const filePath = `${this.dbPath}/${especificacion.code}/${especificacion.file?.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, especificacion.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          especificacion.fileUrl = downloadURL;
          delete especificacion.$key;
          this.especificacionesDB.update(id, especificacion);
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();

  }


  private deleteFileStorage(id: string, name: string): void {
    const storageRef = this.storage.ref(`/${this.dbPath}/${id}`);
    storageRef.child(name).delete();
  }


}
