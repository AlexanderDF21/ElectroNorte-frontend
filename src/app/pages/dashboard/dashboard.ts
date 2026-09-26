import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Reporte } from '../../core/services/reporte';
import { Auth } from '../../core/services/auth';
import { IncidenciaService } from '../../core/services/incidencia';

import { ReporteResumen } from '../../models/reporte-resumen';
import { IncidenciaReciente } from '../../models/incidencia-reciente';
import { ReportePrioridad } from '../../models/reporte-prioridad';
import { ReporteTipo } from '../../models/reporte-tipo';
import { ReporteTecnico } from '../../models/reporte-tecnico';
import { Incidencia } from '../../models/incidencia';

import { Navbar } from '../../components/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  // =========================================
  // DATOS DE SESIÓN
  // =========================================

  nombreUsuario = localStorage.getItem('nombre') ?? 'Usuario';

  rol: string | null = null;

  // =========================================
  // DASHBOARD ADMIN
  // =========================================

  resumen: ReporteResumen | null = null;

  incidenciasRecientes: IncidenciaReciente[] = [];

  reportePrioridad: ReportePrioridad[] = [];

  reporteTipo: ReporteTipo[] = [];

  reporteTecnico: ReporteTecnico[] = [];

  // =========================================
  // DASHBOARD TÉCNICO / USUARIO
  // =========================================

  misIncidencias: Incidencia[] = [];

  // =========================================
  // ESTADO DE PANTALLA
  // =========================================

  cargando = true;

  mensajeError = '';

  constructor(
    private reporteService: Reporte,
    private incidenciaService: IncidenciaService,
    private authService: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  // =========================================
  // INICIO
  // =========================================

  ngOnInit(): void {
    this.rol = this.authService.obtenerRol();

    if (this.esAdmin()) {
      this.cargarDashboardAdmin();
    } else {
      this.cargarDashboardPersonal();
    }
  }

  // =========================================
  // ROLES
  // =========================================

  esAdmin(): boolean {
    return this.rol === 'ADMIN';
  }

  esTecnico(): boolean {
    return this.rol === 'TECNICO';
  }

  esUsuario(): boolean {
    return this.rol === 'USUARIO';
  }

  // =========================================
  // DASHBOARD ADMIN
  // =========================================

  cargarDashboardAdmin(): void {
    this.cargando = true;

    this.mensajeError = '';

    // =======================================
    // RESUMEN
    // =======================================

    this.reporteService.obtenerResumen().subscribe({
      next: (respuesta) => {
        this.resumen = respuesta;

        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error cargando resumen:', error);

        this.mensajeError = 'No se pudo cargar el dashboard.';

        this.cargando = false;

        this.cdr.detectChanges();
      },
    });

    // =======================================
    // INCIDENCIAS RECIENTES
    // =======================================

    this.reporteService.obtenerRecientes().subscribe({
      next: (respuesta) => {
        this.incidenciasRecientes = respuesta;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error cargando incidencias recientes:', error);

        this.cdr.detectChanges();
      },
    });

    // =======================================
    // PRIORIDAD
    // =======================================

    this.reporteService.obtenerPorPrioridad().subscribe({
      next: (respuesta) => {
        this.reportePrioridad = respuesta;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error reporte prioridad:', error);

        this.cdr.detectChanges();
      },
    });

    // =======================================
    // TIPO
    // =======================================

    this.reporteService.obtenerPorTipo().subscribe({
      next: (respuesta) => {
        this.reporteTipo = respuesta;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error reporte tipo:', error);

        this.cdr.detectChanges();
      },
    });

    // =======================================
    // TÉCNICO
    // =======================================

    this.reporteService.obtenerPorTecnico().subscribe({
      next: (respuesta) => {
        this.reporteTecnico = respuesta;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error reporte técnico:', error);

        this.cdr.detectChanges();
      },
    });
  }

  // =========================================
  // DASHBOARD TÉCNICO / USUARIO
  // =========================================

  cargarDashboardPersonal(): void {
    this.cargando = true;

    this.mensajeError = '';

    this.incidenciaService.listar().subscribe({
      next: (respuesta) => {
        this.misIncidencias = respuesta;

        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error cargando incidencias:', error);

        this.mensajeError = 'No se pudieron cargar las incidencias.';

        this.cargando = false;

        this.cdr.detectChanges();
      },
    });
  }

  // =========================================
  // CONTADORES DASHBOARD PERSONAL
  // =========================================

  contarEstado(estado: string): number {
    return this.misIncidencias.filter((incidencia) => incidencia.estado === estado).length;
  }

  contarEnProcesoUsuario(): number {
    const estadosEnProceso = ['REGISTRADA', 'EN_REVISION', 'ASIGNADA', 'EN_ATENCION'];

    return this.misIncidencias.filter((incidencia) => estadosEnProceso.includes(incidencia.estado))
      .length;
  }

  // =========================================
  // PORCENTAJES ADMIN
  // =========================================

  calcularPorcentajePrioridad(cantidad: number): number {
    const maximo = Math.max(...this.reportePrioridad.map((item) => item.cantidad), 1);

    return (cantidad / maximo) * 100;
  }

  calcularPorcentajeTipo(cantidad: number): number {
    const maximo = Math.max(...this.reporteTipo.map((item) => item.cantidad), 1);

    return (cantidad / maximo) * 100;
  }

  calcularPorcentajeTecnico(cantidad: number): number {
    const maximo = Math.max(...this.reporteTecnico.map((item) => item.cantidad), 1);

    return (cantidad / maximo) * 100;
  }

  // =========================================
  // NAVEGACIÓN
  // =========================================

  irIncidencias(): void {
    this.router.navigate(['/incidencias']);
  }

  verIncidencia(id: number): void {
    this.router.navigate(['/incidencias', id]);
  }

  nuevaIncidencia(): void {
    this.router.navigate(['/incidencias/nueva']);
  }

  // =========================================
  // CERRAR SESIÓN
  // =========================================

  cerrarSesion(): void {
    this.authService.cerrarSesion();

    this.router.navigate(['/login']);
  }
}
