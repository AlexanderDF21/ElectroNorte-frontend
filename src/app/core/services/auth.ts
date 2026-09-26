import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginResponse } from '../../models/login-response';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }

  guardarSesion(respuesta: LoginResponse): void {
    localStorage.setItem('token', respuesta.token);
    localStorage.setItem('rol', respuesta.rol);
    localStorage.setItem('nombre', respuesta.nombre);
    localStorage.setItem('email', respuesta.email);
    localStorage.setItem('usuarioId', respuesta.id.toString());
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  estaAutenticado(): boolean {
    return this.obtenerToken() !== null;
  }

  cerrarSesion(): void {
    localStorage.clear();
  }
}
