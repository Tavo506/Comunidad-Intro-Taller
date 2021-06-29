import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  constructor(  private auth : AuthService,
                private router : Router) { }

  ngOnInit(): void {
  }

  scroll(){
    window.scroll(0,0);
  }

  get logueado(){
    return this.auth.estaAutenticado();
  }

  salir(){
    this.auth.logout();
    this.router.navigate(["/login"]);
  }

}
