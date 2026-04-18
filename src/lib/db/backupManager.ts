import JSZip from 'jszip';
import { db } from './database';

/**
 * Backup and Restore Manager
 * Exports all DB content to a ZIP file and restores from it
 */

export const exportProjectBackup = async () => {
  const zip = new JSZip();
  const tables = ['cursos', 'unidades', 'sesiones', 'alumnos', 'incidencias', 'metadata'];
  
  const backupData: Record<string, any[]> = {};
  
  for (const table of tables) {
    backupData[table] = await (db as any)[table].toArray();
  }
  
  zip.file('docente_sis_backup.json', JSON.stringify(backupData, null, 2));
  
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_docente_${new Date().toISOString().slice(0,10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const restoreProjectBackup = async (file: File) => {
  const zip = await JSZip.loadAsync(file);
  const jsonFile = zip.file('docente_sis_backup.json');
  
  if (!jsonFile) throw new Error('Archivo de backup inválido');
  
  const data = JSON.parse(await jsonFile.async('string'));
  
  // Clear and restore tables
  return db.transaction('rw', [db.cursos, db.unidades, db.sesiones, db.alumnos, db.incidencias, db.metadata], async () => {
    for (const [table, items] of Object.entries(data)) {
      await (db as any)[table].clear();
      await (db as any)[table].bulkAdd(items);
    }
  });
};
