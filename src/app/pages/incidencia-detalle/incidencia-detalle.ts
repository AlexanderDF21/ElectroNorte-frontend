import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { IncidenciaService } from '../../core/services/incidencia';

import { UsuarioService } from '../../core/services/usuario';

import { Auth } from '../../core/services/auth';

import { Incidencia } from '../../models/incidencia';

import { HistorialIncidencia } from '../../models/historial-incidencia';

import { AccionIncidencia } from '../../models/accion-incidencia';

import { Usuario } from '../../models/usuario';

import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-incidencia-detalle',
  standalone: true,

  imports: [CommonModule, FormsModule, Navbar],

  templateUrl: './incidencia-detalle.html',
  styleUrl: './incidencia-detalle.css',
})
export class IncidenciaDetalle implements OnInit {
  // =========================
  // DATOS
  // =========================

  incidencia: Incidencia | null = null;

  historial: HistorialIncidencia[] = [];

  acciones: AccionIncidencia[] = [];

  tecnicos: Usuario[] = [];

  tecnicoSeleccionado: number | null = null;

  descripcionAccion = '';

  rol: string | null = null;

  // =========================
  // ESTADOS DE LA PANTALLA
  // =========================

  cargando = true;

  procesando = false;

  mensajeError = '';

  mensajeExito = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidenciaService: IncidenciaService,
    private usuarioService: UsuarioService,
    private auth: Auth,
    private cdr: ChangeDetectorRef,
  ) {}

  // =========================
  // INICIO
  // =========================

  ngOnInit(): void {
    this.rol = this.auth.obtenerRol();

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.mensajeError = 'El identificador de la incidencia no es válido.';

      this.cargando = false;

      return;
    }

    this.cargarIncidencia(id);

    this.cargarHistorial(id);

    this.cargarAcciones(id);

    // Solo ADMIN necesita cargar
    // la lista completa de técnicos.
    if (this.esAdmin()) {
      this.cargarTecnicos();
    }
  }

  // =========================
  // ROLES
  // =========================

  esAdmin(): boolean {
    return this.rol === 'ADMIN';
  }

  esTecnico(): boolean {
    return this.rol === 'TECNICO';
  }

  esUsuario(): boolean {
    return this.rol === 'USUARIO';
  }

  // =========================
  // CARGAR INCIDENCIA
  // =========================

  cargarIncidencia(id: number): void {
    this.cargando = true;

    this.mensajeError = '';

    this.incidenciaService.buscarPorId(id).subscribe({
      next: (respuesta) => {
        console.log('Detalle incidencia:', respuesta);

        this.incidencia = respuesta;

        this.cargando = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error cargando incidencia:', error);

        this.mensajeError = 'No se pudo cargar la incidencia.';

        this.cargando = false;

        this.cdr.markForCheck();
      },
    });
  }

  // =========================
  // CARGAR HISTORIAL
  // =========================

  cargarHistorial(id: number): void {
    this.incidenciaService.obtenerHistorial(id).subscribe({
      next: (respuesta) => {
        this.historial = respuesta;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error cargando historial:', error);

        this.cdr.markForCheck();
      },
    });
  }

  // =========================
  // CARGAR ACCIONES
  // =========================

  cargarAcciones(id: number): void {
    this.incidenciaService.obtenerAcciones(id).subscribe({
      next: (respuesta) => {
        this.acciones = respuesta;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error cargando acciones:', error);

        this.cdr.markForCheck();
      },
    });
  }

  // =========================
  // CARGAR TÉCNICOS
  // =========================

  cargarTecnicos(): void {
    this.usuarioService.listar().subscribe({
      next: (respuesta) => {
        this.tecnicos = respuesta.filter(
          (usuario) => usuario.rol === 'TECNICO' && usuario.estado === true,
        );

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error cargando técnicos:', error);

        this.cdr.markForCheck();
      },
    });
  }

  // =========================
  // ADMIN:
  // PASAR A REVISIÓN
  // =========================

  pasarARevision(): void {
    if (!this.incidencia) {
      return;
    }

    const id = this.incidencia.id;

    this.procesando = true;

    this.limpiarMensajes();

    this.incidenciaService.cambiarEstado(id, 'EN_REVISION').subscribe({
      next: () => {
        this.mensajeExito = 'La incidencia pasó a revisión correctamente.';

        this.procesando = false;

        this.actualizarDetalle(id);

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo cambiar el estado de la incidencia.');
      },
    });
  }

  // =========================
  // ADMIN:
  // ASIGNAR TÉCNICO
  // =========================

  asignarTecnico(): void {
    if (!this.incidencia) {
      return;
    }

    if (!this.tecnicoSeleccionado) {
      this.mensajeError = 'Debe seleccionar un técnico.';

      this.mensajeExito = '';

      this.cdr.markForCheck();

      return;
    }

    const incidenciaId = this.incidencia.id;

    this.procesando = true;

    this.limpiarMensajes();

    this.incidenciaService.asignarTecnico(incidenciaId, this.tecnicoSeleccionado).subscribe({
      next: () => {
        this.mensajeExito = 'Técnico asignado correctamente.';

        this.procesando = false;

        this.tecnicoSeleccionado = null;

        this.actualizarDetalle(incidenciaId);

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo asignar el técnico.');
      },
    });
  }

  // =========================
  // TÉCNICO:
  // INICIAR ATENCIÓN
  // =========================

  iniciarAtencion(): void {
    if (!this.incidencia) {
      return;
    }

    const id = this.incidencia.id;

    this.procesando = true;

    this.limpiarMensajes();

    this.incidenciaService.cambiarEstado(id, 'EN_ATENCION').subscribe({
      next: () => {
        this.mensajeExito = 'La atención de la incidencia ha sido iniciada.';

        this.procesando = false;

        this.actualizarDetalle(id);

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo iniciar la atención.');
      },
    });
  }

  // =========================
  // TÉCNICO:
  // REGISTRAR ACCIÓN
  // =========================

  registrarAccion(): void {
    if (!this.incidencia) {
      return;
    }

    const descripcion = this.descripcionAccion.trim();

    if (!descripcion) {
      this.mensajeError = 'Debe ingresar la descripción de la acción realizada.';

      this.mensajeExito = '';

      this.cdr.markForCheck();

      return;
    }

    const id = this.incidencia.id;

    this.procesando = true;

    this.limpiarMensajes();

    this.incidenciaService.registrarAccion(id, descripcion).subscribe({
      next: () => {
        this.descripcionAccion = '';

        this.mensajeExito = 'Acción registrada correctamente.';

        this.procesando = false;

        this.cargarAcciones(id);

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo registrar la acción.');
      },
    });
  }

  // =========================
  // TÉCNICO:
  // RESOLVER INCIDENCIA
  // =========================

  resolverIncidencia(): void {
    if (!this.incidencia) {
      return;
    }

    const id = this.incidencia.id;

    this.procesando = true;

    this.limpiarMensajes();

    this.incidenciaService.cambiarEstado(id, 'RESUELTA').subscribe({
      next: () => {
        this.mensajeExito = 'La incidencia fue marcada como resuelta.';

        this.procesando = false;

        this.actualizarDetalle(id);

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo resolver la incidencia.');
      },
    });
  }

  // =========================
  // ADMIN:
  // CERRAR INCIDENCIA
  // =========================

  cerrarIncidencia(): void {
    if (!this.incidencia) {
      return;
    }

    const id = this.incidencia.id;

    this.procesando = true;

    this.limpiarMensajes();

    this.incidenciaService.cambiarEstado(id, 'CERRADA').subscribe({
      next: () => {
        this.mensajeExito = 'La incidencia fue cerrada correctamente.';

        this.procesando = false;

        this.actualizarDetalle(id);

        this.cdr.markForCheck();
      },

      error: (error) => {
        this.manejarError(error, 'No se pudo cerrar la incidencia.');
      },
    });
  }

  // =========================
  // ACTUALIZAR PANTALLA
  // =========================

  actualizarDetalle(id: number): void {
    this.cargarIncidencia(id);

    this.cargarHistorial(id);

    this.cargarAcciones(id);
  }

  // =========================
  // LIMPIAR MENSAJES
  // =========================

  limpiarMensajes(): void {
    this.mensajeError = '';

    this.mensajeExito = '';
  }

  // =========================
  // MANEJO DE ERRORES
  // =========================

  manejarError(error: any, mensajePredeterminado: string): void {
    console.error('Error:', error);

    this.mensajeError = error.error?.message || mensajePredeterminado;

    this.mensajeExito = '';

    this.procesando = false;

    this.cdr.markForCheck();
  }

  // =========================
  // VOLVER
  // =========================

  volver(): void {
    this.router.navigate(['/incidencias']);
  }
}
