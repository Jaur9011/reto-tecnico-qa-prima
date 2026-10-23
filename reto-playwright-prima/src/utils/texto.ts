// "$29.99" -> 29.99
export function aNumero(texto: string | null): number {
  const valor = Number((texto ?? '').replace(/[^0-9.]/g, ''));
  if (Number.isNaN(valor)) {
    throw new Error(`No se pudo convertir a número: "${texto}"`);
  }
  return valor;
}

// Regex para comparar un texto exacto
export function textoExacto(texto: string): RegExp {
  const escapado = texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^\\s*${escapado}\\s*$`);
}
