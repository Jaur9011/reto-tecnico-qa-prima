import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Lee un CSV de src/data (primera fila = nombres de columna)
export function leerCsv(nombreArchivo: string): Record<string, string>[] {
  const contenido = readFileSync(join(__dirname, '..', 'data', nombreArchivo), 'utf-8').replace(/^﻿/, '');
  const [cabecera, ...filas] = contenido.split(/\r?\n/).filter((linea) => linea.trim() !== '');
  const columnas = cabecera.split(',').map((c) => c.trim());

  return filas.map((fila) => {
    const valores = fila.split(',');
    return Object.fromEntries(columnas.map((columna, i) => [columna, (valores[i] ?? '').trim()]));
  });
}
