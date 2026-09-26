export interface Incidencia {
  id: number;
  codigo: string;

  titulo: string;
  descripcion: string;
  ubicacion: string;

  prioridad: string;
  estado: string;

  fechaRegistro: string;

  fechaAsignacion?: string | null;
  fechaInicioAtencion?: string | null;
  fechaResolucion?: string | null;
  fechaCierre?: string | null;

  usuarioId?: number;
  usuarioNombre?: string;

  tipoIncidenciaId?: number;
  tipoIncidenciaNombre?: string;

  tecnicoId?: number | null;
  tecnicoNombre?: string | null;
}
