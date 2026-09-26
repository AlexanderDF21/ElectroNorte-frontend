import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IncidenciaService } from '../../core/services/incidencia';

import { TipoIncidenciaService } from '../../core/services/tipo-incidencia';

import { TipoIncidencia } from '../../models/tipo-incidencia';

import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-incidencia-nueva',
  standalone: true,

  imports: [CommonModule, FormsModule, Navbar],

  templateUrl: './incidencia-nueva.html',
  styleUrl: './incidencia-nueva.css',
})
export class IncidenciaNueva implements OnInit {
  // =========================================
  // FORMULARIO
  // =========================================

  titulo = '';

  descripcion = '';

  ubicacion = '';

  prioridad = 'MEDIA';

  tipoIncidenciaId: number | null = null;

  // =========================================
  // TIPOS
  // =========================================

  tiposIncidencia: TipoIncidencia[] = [];

  // =========================================
  // ESTADO
  // =========================================

  cargandoTipos = true;

  procesando = false;

  mensajeError = '';

  mensajeExito = '';

  constructor(
    private incidenciaService: IncidenciaService,
    private tipoIncidenciaService: TipoIncidenciaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  // =========================================
  // INICIO
  // =========================================

  ngOnInit(): void {
    this.cargarTipos();
  }

  // =========================================
  // CARGAR TIPOS
  // =========================================

  cargarTipos(): void {
    this.cargandoTipos = true;

    this.tipoIncidenciaService.listar().subscribe({
      next: (respuesta) => {
        // Mostramos únicamente
        // tipos activos.

        this.tiposIncidencia = respuesta.filter((tipo) => tipo.estado === true);

        this.cargandoTipos = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error cargando tipos:', error);

        this.mensajeError = 'No se pudieron cargar los tipos de incidencia.';

        this.cargandoTipos = false;

        this.cdr.markForCheck();
      },
    });
  }

  // =========================================
  // REGISTRAR
  // =========================================

  registrar(): void {
    this.mensajeError = '';

    this.mensajeExito = '';

    // =======================================
    // VALIDACIONES
    // =======================================

    if (!this.titulo.trim()) {
      this.mensajeError = 'Ingrese el título de la incidencia.';

      return;
    }

    if (!this.tipoIncidenciaId) {
      this.mensajeError = 'Seleccione un tipo de incidencia.';

      return;
    }

    if (!this.ubicacion.trim()) {
      this.mensajeError = 'Ingrese la ubicación de la incidencia.';

      return;
    }

    if (!this.descripcion.trim()) {
      this.mensajeError = 'Ingrese la descripción de la incidencia.';

      return;
    }

    // =======================================
    // REQUEST
    // =======================================

    const request = {
      titulo: this.titulo.trim(),

      descripcion: this.descripcion.trim(),

      ubicacion: this.ubicacion.trim(),

      prioridad: this.prioridad,

      tipoIncidenciaId: this.tipoIncidenciaId,
    };

    this.procesando = true;

    this.incidenciaService.crear(request).subscribe({
      next: (respuesta) => {
        this.procesando = false;

        this.mensajeExito = 'Incidencia registrada correctamente.';

        this.cdr.markForCheck();

        // Abrimos automáticamente
        // la incidencia creada.

        this.router.navigate(['/incidencias', respuesta.id]);
      },

      error: (error) => {
        console.error('Error registrando incidencia:', error);

        this.procesando = false;

        this.mensajeError = error.error?.message || 'No se pudo registrar la incidencia.';

        this.cdr.markForCheck();
      },
    });
  }

  // =========================================
  // CANCELAR
  // =========================================

  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }
}
