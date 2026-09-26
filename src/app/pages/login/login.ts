import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email = '';
  password = '';

  cargando = false;
  mensajeError = '';

  constructor(
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  iniciarSesion(): void {

    this.mensajeError = '';

    if (!this.email || !this.password) {
      this.mensajeError = 'Debe ingresar correo y contraseña';
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;

    this.authService.login(this.email, this.password).subscribe({

      next: (respuesta) => {

        this.authService.guardarSesion(respuesta);

        this.cargando = false;

        this.router.navigate(['/dashboard']);
      },

      error: () => {

        this.cargando = false;

        this.mensajeError =
          'Correo electrónico o contraseña incorrectos';

        this.cdr.detectChanges();
      }

    });
  }
}