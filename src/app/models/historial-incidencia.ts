export interface HistorialIncidencia {
  id: number;

  tipoCambio: string;

  estadoAnterior?: string | null;

  estadoNuevo?: string | null;

  comentario?: string | null;

  fecha: string;

  usuarioNombre?: string | null;
}
