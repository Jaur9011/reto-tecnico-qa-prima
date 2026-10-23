import { leerCsv } from '../utils/csv';
import { DatosEnvio } from '../pages/CheckoutInformacionPage';

export function obtenerCliente(id: string): DatosEnvio {
  const clientes = leerCsv('clientes.csv');
  const cliente = clientes.find((c) => c.id === id);
  if (!cliente) {
    throw new Error(`Cliente "${id}" no existe en clientes.csv. Disponibles: ${clientes.map((c) => c.id).join(', ')}`);
  }
  return { nombre: cliente.nombre, apellido: cliente.apellido, codigoPostal: cliente.codigoPostal };
}
