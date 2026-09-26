import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { UsuarioService, UsuarioRequest } from '../../core/services/usuario';

import { Auth } from '../../core/services/auth';

import { Usuario } from '../../models/usuario';

import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-usuarios',
  standalone: true,

  imports: [CommonModule, FormsModule, Navbar],

  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  usuarios: Usuario[] = [];

  cargando = true;

  procesando = false;

  mostrarFormulario = false;

  modoEdicion = false;

  usuarioEditandoId: number | null = null;

  mensajeError = '';

  mensajeExito = '';

  formulario: UsuarioRequest = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'USUARIO',
    estado: true,
  };

  constructor(
    private usuarioService: UsuarioService,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Protección visual adicional.
    // El backend continúa siendo la protección real.

    if (this.authService.obtenerRol() !== 'ADMIN') {
      this.router.navigate(['/dashboard']);

      return;
    }

    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;

    this.mensajeError = '';

    this.usuarioService.listar().subscribe({
      next: (respuesta) => {
        this.usuarios = respuesta;

        this.cargando = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error cargando usuarios:', error);

        this.cargando = false;

        this.mensajeError = 'No se pudieron cargar los usuarios.';

        this.cdr.markForCheck();
      },
    });
  }

  nuevoUsuario(): void {
    this.limpiarMensajes();

    this.modoEdicion = false;

    this.usuarioEditandoId = null;

    this.formulario = {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      rol: 'USUARIO',
      estado: true,
    };

    this.mostrarFormulario = true;
  }

  editarUsuario(usuario: Usuario): void {
    this.limpiarMensajes();

    this.modoEdicion = true;

    this.usuarioEditandoId = usuario.id;

    this.formulario = {
      nombre: usuario.nombre,

      apellido: usuario.apellido,

      email: usuario.email,

      // El backend no devuelve passwords.
      password: '',

      rol: usuario.rol,

      estado: usuario.estado,
    };

    this.mostrarFormulario = true;
  }

  guardar(): void {
    this.limpiarMensajes();

    if (!this.formulario.nombre.trim()) {
      this.mensajeError = 'El nombre es obligatorio.';

      return;
    }

    if (!this.formulario.apellido.trim()) {
      this.mensajeError = 'El apellido es obligatorio.';

      return;
    }

    if (!this.formulario.email.trim()) {
      this.mensajeError = 'El correo electrónico es obligatorio.';

      return;
    }

    if (!this.formulario.password || this.formulario.password.length < 6) {
      this.mensajeError = this.modoEdicion
        ? 'Para actualizar el usuario debe ingresar una contraseña de mínimo 6 caracteres.'
        : 'La contraseña debe tener como mínimo 6 caracteres.';

      return;
    }

    this.procesando = true;

    const request: UsuarioRequest = {
      nombre: this.formulario.nombre.trim(),

      apellido: this.formulario.apellido.trim(),

      email: this.formulario.email.trim(),

      password: this.formulario.password,

      rol: this.formulario.rol,

      estado: this.formulario.estado,
    };

    if (this.modoEdicion && this.usuarioEditandoId !== null) {
      this.actualizarUsuario(this.usuarioEditandoId, request);
    } else {
      this.crearUsuario(request);
    }
  }

  crearUsuario(request: UsuarioRequest): void {
    this.usuarioService.crear(request).subscribe({
      next: () => {
        this.procesando = false;

        this.mostrarFormulario = false;

        this.mensajeExito = 'Usuario creado correctamente.';

        this.cargarUsuarios();

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo crear el usuario.');
      },
    });
  }

  actualizarUsuario(id: number, request: UsuarioRequest): void {
    this.usuarioService.actualizar(id, request).subscribe({
      next: () => {
        this.procesando = false;

        this.mostrarFormulario = false;

        this.mensajeExito = 'Usuario actualizado correctamente.';

        this.cargarUsuarios();

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo actualizar el usuario.');
      },
    });
  }

  desactivarUsuario(usuario: Usuario): void {
    if (!usuario.estado) {
      return;
    }

    const confirmar = confirm(
      `¿Desea desactivar al usuario ${usuario.nombre} ${usuario.apellido}?`,
    );

    if (!confirmar) {
      return;
    }

    this.limpiarMensajes();

    this.procesando = true;

    this.usuarioService.desactivar(usuario.id).subscribe({
      next: () => {
        this.procesando = false;

        this.mensajeExito = 'Usuario desactivado correctamente.';

        this.cargarUsuarios();

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo desactivar el usuario.');
      },
    });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;

    this.modoEdicion = false;

    this.usuarioEditandoId = null;

    this.limpiarMensajes();
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }

  limpiarMensajes(): void {
    this.mensajeError = '';

    this.mensajeExito = '';
  }

  manejarError(error: any, mensaje: string): void {
    console.error(error);

    this.procesando = false;

    this.mensajeError = error.error?.message || mensaje;

    this.cdr.markForCheck();
  }
}
