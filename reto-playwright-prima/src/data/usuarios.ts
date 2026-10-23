import '../config/env';

const password = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const usuarios = {
  standard_user: { usuario: 'standard_user', password },
  locked_out_user: { usuario: 'locked_out_user', password }
} as const;

export type TipoUsuario = keyof typeof usuarios;

export function obtenerUsuario(tipo: string) {
  if (!(tipo in usuarios)) {
    throw new Error(`Usuario de prueba no definido: "${tipo}". Disponibles: ${Object.keys(usuarios).join(', ')}`);
  }
  return usuarios[tipo as TipoUsuario];
}
