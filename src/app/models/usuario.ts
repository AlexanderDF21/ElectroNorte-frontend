export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'ADMIN' | 'TECNICO' | 'SUPERVISOR' | 'USUARIO';
  estado: boolean;
}
