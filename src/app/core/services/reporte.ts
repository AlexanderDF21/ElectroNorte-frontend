import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ReporteResumen } from '../../models/reporte-resumen';
import { IncidenciaReciente } from '../../models/incidencia-reciente';
import { ReportePrioridad } from '../../models/reporte-prioridad';
import { ReporteTipo } from '../../models/reporte-tipo';
import { ReporteTecnico } from '../../models/reporte-tecnico';

@Injectable({
  providedIn: 'root',
})
export class Reporte {
  private readonly apiUrl = 'https://electronorte-backend-b3bdfmg4cydkh8dg.chilecentral-01.azurewebsites.net/api/reportes';

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<ReporteResumen> {
    return this.http.get<ReporteResumen>(`${this.apiUrl}/resumen`);
  }

  obtenerRecientes(): Observable<IncidenciaReciente[]> {
    return this.http.get<IncidenciaReciente[]>(`${this.apiUrl}/recientes`);
  }
  obtenerPorPrioridad(): Observable<ReportePrioridad[]> {
    return this.http.get<ReportePrioridad[]>(`${this.apiUrl}/por-prioridad`);
  }

  obtenerPorTipo(): Observable<ReporteTipo[]> {
    return this.http.get<ReporteTipo[]>(`${this.apiUrl}/por-tipo`);
  }

  obtenerPorTecnico(): Observable<ReporteTecnico[]> {
    return this.http.get<ReporteTecnico[]>(`${this.apiUrl}/por-tecnico`);
  }
}
