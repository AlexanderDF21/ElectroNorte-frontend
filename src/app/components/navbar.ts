import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Auth } from '../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [CommonModule, RouterLink, RouterLinkActive],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  rol: string | null = null;

  nombre: string | null = null;

  constructor(
    private authService: Auth,
    private router: Router,
  ) {
    this.rol = this.authService.obtenerRol();

    this.nombre = localStorage.getItem('nombre');
  }

  esAdmin(): boolean {
    return this.rol === 'ADMIN';
  }

  esTecnico(): boolean {
    return this.rol === 'TECNICO';
  }

  esUsuario(): boolean {
    return this.rol === 'USUARIO';
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();

    this.router.navigate(['/login']);
  }
}
