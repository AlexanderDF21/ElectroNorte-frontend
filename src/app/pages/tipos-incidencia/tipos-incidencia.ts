import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TipoIncidenciaService } from '../../core/services/tipo-incidencia';

import { TipoIncidencia } from '../../models/tipo-incidencia';

import { Auth } from '../../core/services/auth';

import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-tipos-incidencia',
  standalone: true,

  imports: [CommonModule, FormsModule, Navbar],

  templateUrl: './tipos-incidencia.html',
  styleUrl: './tipos-incidencia.css',
})
export class TiposIncidencia implements OnInit {
  tipos: TipoIncidencia[] = [];

  cargando = true;

  procesando = false;

  mostrarFormulario = false;

  modoEdicion = false;

  tipoEditandoId: number | null = null;

  mensajeError = '';

  mensajeExito = '';

  formulario = {
    nombre: '',
    descripcion: '',
    estado: true,
  };

  constructor(
    private tipoService: TipoIncidenciaService,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Solo ADMIN puede acceder visualmente.
    // Spring Security continúa siendo
    // la protección real del backend.

    if (this.authService.obtenerRol() !== 'ADMIN') {
      this.router.navigate(['/dashboard']);

      return;
    }

    this.cargarTipos();
  }

  // =========================================
  // LISTAR
  // =========================================

  cargarTipos(): void {
    this.cargando = true;

    this.mensajeError = '';

    this.tipoService.listar().subscribe({
      next: (respuesta) => {
        this.tipos = respuesta;

        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error cargando tipos:', error);

        this.cargando = false;

        this.mensajeError = 'No se pudieron cargar los tipos de incidencia.';

        this.cdr.detectChanges();
      },
    });
  }

  // =========================================
  // NUEVO
  // =========================================

  nuevoTipo(): void {
    this.limpiarMensajes();

    this.modoEdicion = false;

    this.tipoEditandoId = null;

    this.formulario = {
      nombre: '',

      descripcion: '',

      estado: true,
    };

    this.mostrarFormulario = true;
  }

  // =========================================
  // EDITAR
  // =========================================

  editarTipo(tipo: TipoIncidencia): void {
    this.limpiarMensajes();

    this.modoEdicion = true;

    this.tipoEditandoId = tipo.id;

    this.formulario = {
      nombre: tipo.nombre,

      descripcion: tipo.descripcion || '',

      estado: tipo.estado,
    };

    this.mostrarFormulario = true;
  }

  // =========================================
  // GUARDAR
  // =========================================

  guardar(): void {
    this.limpiarMensajes();

    if (!this.formulario.nombre.trim()) {
      this.mensajeError = 'El nombre del tipo de incidencia es obligatorio.';

      return;
    }

    this.procesando = true;

    const request = {
      nombre: this.formulario.nombre.trim(),

      descripcion: this.formulario.descripcion.trim(),

      estado: this.formulario.estado,
    };

    if (this.modoEdicion && this.tipoEditandoId !== null) {
      this.actualizar(this.tipoEditandoId, request);
    } else {
      this.crear(request);
    }
  }

  // =========================================
  // CREAR
  // =========================================

  crear(request: Partial<TipoIncidencia>): void {
    this.tipoService.crear(request).subscribe({
      next: () => {
        this.procesando = false;

        this.mostrarFormulario = false;

        this.mensajeExito = 'Tipo de incidencia creado correctamente.';

        // Forzamos actualización visual
        // antes de recargar la lista.
        this.cdr.detectChanges();

        this.cargarTipos();
      },

      error: (error) => {
        console.error('Error creando tipo:', error);

        this.procesando = false;

        this.mensajeError = error.error?.message || 'No se pudo crear el tipo de incidencia.';

        this.cdr.detectChanges();
      },
    });
  }

  // =========================================
  // ACTUALIZAR
  // =========================================

  actualizar(id: number, request: Partial<TipoIncidencia>): void {
    this.tipoService.actualizar(id, request).subscribe({
      next: () => {
        this.procesando = false;

        this.mostrarFormulario = false;

        this.mensajeExito = 'Tipo de incidencia actualizado correctamente.';

        this.cargarTipos();

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo actualizar el tipo de incidencia.');
      },
    });
  }

  // =========================================
  // DESACTIVAR
  // =========================================

  desactivar(tipo: TipoIncidencia): void {
    if (!tipo.estado) {
      return;
    }

    const confirmar = confirm(`¿Desea desactivar el tipo "${tipo.nombre}"?`);

    if (!confirmar) {
      return;
    }

    this.limpiarMensajes();

    this.procesando = true;

    this.tipoService.desactivar(tipo.id).subscribe({
      next: () => {
        this.procesando = false;

        this.mensajeExito = 'Tipo de incidencia desactivado correctamente.';

        this.cargarTipos();

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo desactivar el tipo de incidencia.');
      },
    });
  }

  // =========================================
  // CANCELAR FORMULARIO
  // =========================================

  cancelarFormulario(): void {
    this.mostrarFormulario = false;

    this.modoEdicion = false;

    this.tipoEditandoId = null;

    this.limpiarMensajes();
  }

  // =========================================
  // VOLVER
  // =========================================

  volver(): void {
    this.router.navigate(['/dashboard']);
  }

  // =========================================
  // MENSAJES
  // =========================================

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
