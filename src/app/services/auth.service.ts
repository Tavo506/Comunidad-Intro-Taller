import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../model/Usuario';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';


import { map } from 'rxjs/operators';
import { localizedString } from '@angular/compiler/src/output/output_ast';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //NOTE: firebase properties: para usar el API de AUTH de firebase
  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private apikey = 'AIzaSyDAdNFNb2f9QbdbjJfxUlT0Ayp-yrTs2W0';

  //NOTE importante para tener el token, validarlo 
  userToken: string = "";

  // Crear nuevo usuario
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]


  // Login
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]

  private comunidadIT_user : any = {
    token : String,
    expira : String,
    nombre : String
  }

  private usuariosDB! : AngularFireList<Usuario>;

  //NOTE: lo primero que hace el servicio es leerToken del localStorage
  constructor( private http: HttpClient, private db: AngularFireDatabase ) {
    this.usuariosDB = this.db.list('/Usuarios');
    this.leerToken();
  }

  // el logout es tan simple como quitar del local storage el token
  // ya en FE, se hace logout y se redirecciona a login component
  logout() {
    localStorage.removeItem('comunidadIT_user');
  }

  // login llama al api de firebase
  login( usuario: Usuario ) {

    //...usuario es pasar toda la data el usuario como js object,
    // más la propiedad para que fb retorne un token
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    //retorna el observable de http, con un pipe para guardar el token de una vez
    // en el local storage, que es el equivalente a estar logueado
    return this.http.post(
      `${ this.url }/verifyPassword?key=${ this.apikey }`,
      authData
    ).pipe(
      map( (resp:any) => {
        this.comunidadIT_user.token = resp['idToken'];

        this.getNombreUsuario(resp.localId).subscribe(res => {
          this.comunidadIT_user.nombre = res;
          this.guardarToken( this.comunidadIT_user ); //guarda en LS
        });
        return resp;

      })
    ); 
  }


  getNombreUsuario(id:string) : Observable<any>{
    return this.usuariosDB.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((c) => ({
          $key: c.payload.key,
          ...c.payload.val(),
        })).filter(e => e.$key == id)[0].nombre;
      })
    );
  }


  // NOTE: usa el API para crear un usuario
  nuevoUsuario( usuario: Usuario ) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }/signupNewUser?key=${ this.apikey }`,
      authData
    ).pipe(
      map( (resp:any) => {
        this.comunidadIT_user.nombre = usuario.nombre;
        this.comunidadIT_user.token = resp['idToken'];

        this.usuariosDB.set(resp.localId, 
          {
          nombre : usuario.nombre,
          email : usuario.email
        });
        
        this.guardarToken( this.comunidadIT_user ); //guarda en LS
        return resp;
        
      })
    );

  }


  //guarda el token y el tiempo en el LS
  // importante, esto es para simular el manejo del token, el 
  // backend debería de manejar si el token está o no activo aún
  private guardarToken( usuario: any ) {
    this.userToken = usuario.token;

    let hoy = new Date();
    hoy.setSeconds( 7200 );
    usuario.expira = hoy.getTime().toString()

    localStorage.setItem('comunidadIT_user', JSON.stringify(usuario) );
  }

  // si está en local storage, lo asigna al atributo
  // sino, va en nulo para que vaya por uno nuevo
  leerToken() {
    if ( JSON.parse(localStorage.getItem('comunidadIT_user')!) ) {
      this.userToken = JSON.parse(localStorage.getItem('comunidadIT_user')!).token
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  //valida que el token exista
  estaAutenticado(): boolean {
    if ( !localStorage.getItem('comunidadIT_user') ) {
      return false;
    }

    //obtiene la fecha y hora de expiración
    const expira = Number(JSON.parse(localStorage.getItem('comunidadIT_user')!).expira);
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    // si es válido o no
    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }


  }

  
}
