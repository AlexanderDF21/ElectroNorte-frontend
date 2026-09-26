import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Incidencia } from '../../models/incidencia';

import { HistorialIncidencia } from '../../models/historial-incidencia';

import { AccionIncidencia } from '../../models/accion-incidencia';

@Injectable({
  providedIn: 'root',
})
export class IncidenciaService {
  private readonly apiUrl = 'http://localhost:8080/api/incidencias';

  constructor(private http: HttpClient) {}

  // =========================
  // LISTAR INCIDENCIAS
  // =========================

  listar(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(this.apiUrl);
  }

  // =========================
  // BUSCAR POR ID
  // =========================

  buscarPorId(id: number): Observable<Incidencia> {
    return this.http.get<Incidencia>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // OBTENER HISTORIAL
  // =========================

  obtenerHistorial(id: number): Observable<HistorialIncidencia[]> {
    return this.http.get<HistorialIncidencia[]>(`${this.apiUrl}/${id}/historial`);
  }

  // =========================
  // OBTENER ACCIONES
  // =========================

  obtenerAcciones(id: number): Observable<AccionIncidencia[]> {
    return this.http.get<AccionIncidencia[]>(`${this.apiUrl}/${id}/acciones`);
  }

  // =========================
  // REGISTRAR ACCIÓN
  // SOLO TÉCNICO
  // =========================

  registrarAccion(incidenciaId: number, descripcion: string): Observable<AccionIncidencia> {
    return this.http.post<AccionIncidencia>(`${this.apiUrl}/${incidenciaId}/acciones`, {
      descripcion,
    });
  }

  // =========================
  // CAMBIAR ESTADO
  // =========================

  cambiarEstado(id: number, estado: string): Observable<Incidencia> {
    return this.http.put<Incidencia>(`${this.apiUrl}/${id}/estado?estado=${estado}`, {});
  }
  crear(incidencia: {
    titulo: string;
    descripcion: string;
    ubicacion: string;
    prioridad: string;
    tipoIncidenciaId: number;
  }): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.apiUrl, incidencia);
  }

  // =========================
  // ASIGNAR TÉCNICO
  // =========================

  asignarTecnico(incidenciaId: number, tecnicoId: number): Observable<Incidencia> {
    return this.http.put<Incidencia>(
      `${this.apiUrl}/${incidenciaId}/asignar?tecnicoId=${tecnicoId}`,
      {},
    );
  }
}
