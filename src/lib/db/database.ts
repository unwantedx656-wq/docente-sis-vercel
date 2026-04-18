import Dexie, { Table } from 'dexie';

export interface Metadata {
  key: string;
  value: any;
}

export interface Curso {
  id?: number;
  nombre: string;
  grado: string;
  seccion?: string;
}

export interface Unidad {
  id?: number;
  cursoId: number;
  titulo: string;
  orden: number;
  objetivo?: string;
}

export interface Sesion {
  id?: number;
  unidadId: number;
  titulo: string;
  fecha: string;
  duracion: string;
  objetivo: string;
  actividades: string;
}

export interface AlumnoEncrypted {
  id?: number;
  grupoId: number;
  nombreEnc: string;
  apellidosEnc: string;
  dniEnc: string;
  alergiasEnc?: string;
  condicionesEnc?: string;
  iv: string;
}

export interface IncidenciaEncrypted {
  id?: number;
  alumnoId: number;
  descripcionEnc: string;
  fecha: string;
  iv: string;
}

export interface SyncQueueItem {
  id?: number;
  entity: string;
  operation: 'create' | 'update' | 'delete';
  payload: any;
  timestamp: number;
  synced: boolean;
}

export class DocenteDB extends Dexie {
  cursos!: Table<Curso>;
  unidades!: Table<Unidad>;
  sesiones!: Table<Sesion>;
  configuracion!: Table<any>;
  alumnos!: Table<AlumnoEncrypted>;
  incidencias!: Table<IncidenciaEncrypted>;
  syncQueue!: Table<SyncQueueItem>;
  metadata!: Table<Metadata>;

  constructor() {
    super('DocenteSIS_DB');
    this.version(1).stores({
      cursos: '++id, nombre, grado',
      unidades: '++id, cursoId, titulo, orden',
      sesiones: '++id, unidadId, titulo, fecha',
      configuracion: 'key',
      alumnos: '++id, grupoId',
      incidencias: '++id, alumnoId, fecha',
      syncQueue: '++id, entity, operation, synced',
      metadata: 'key'
    });
  }
}

export const db = new DocenteDB();
