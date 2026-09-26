import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { IncidenciaService } from '../../core/services/incidencia';
import { Incidencia } from '../../models/incidencia';
import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './incidencias.html',
  styleUrl: './incidencias.css',
})
export class Incidencias implements OnInit {
  incidencias: Incidencia[] = [];

  cargando = true;
  mensajeError = '';

  constructor(
    private incidenciaService: IncidenciaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarIncidencias();
  }

  cargarIncidencias(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.incidenciaService.listar().subscribe({
      next: (respuesta) => {
        console.log('Incidencias recibidas:', respuesta);

        this.incidencias = respuesta;

        this.cargando = false;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.error('Error cargando incidencias:', error);

        this.mensajeError = 'No se pudieron cargar las incidencias.';

        this.cargando = false;

        this.cdr.markForCheck();
      },
    });
  }

  volverDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  verDetalle(id: number): void {
    this.router.navigate(['/incidencias', id]);
  }
}
