import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TipoIncidencia } from '../../models/tipo-incidencia';

@Injectable({
  providedIn: 'root',
})
export class TipoIncidenciaService {
  private readonly apiUrl = 'http://localhost:8080/api/tipos-incidencia';

  constructor(private http: HttpClient) {}

  // =========================================
  // LISTAR TIPOS DE INCIDENCIA
  // =========================================

  listar(): Observable<TipoIncidencia[]> {
    return this.http.get<TipoIncidencia[]>(this.apiUrl);
  }

  // =========================================
  // BUSCAR POR ID
  // =========================================

  buscarPorId(id: number): Observable<TipoIncidencia> {
    return this.http.get<TipoIncidencia>(`${this.apiUrl}/${id}`);
  }

  // =========================================
  // CREAR
  // ADMIN
  // =========================================

  crear(tipo: Partial<TipoIncidencia>): Observable<TipoIncidencia> {
    return this.http.post<TipoIncidencia>(this.apiUrl, tipo);
  }

  // =========================================
  // ACTUALIZAR
  // ADMIN
  // =========================================

  actualizar(id: number, tipo: Partial<TipoIncidencia>): Observable<TipoIncidencia> {
    return this.http.put<TipoIncidencia>(`${this.apiUrl}/${id}`, tipo);
  }

  // =========================================
  // DESACTIVAR
  // ADMIN
  // =========================================

  desactivar(id: number): Observable<TipoIncidencia> {
    return this.http.delete<TipoIncidencia>(`${this.apiUrl}/${id}`);
  }
}
