import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Cliente "público": lo usan la tienda y el navegador.
// Las políticas de seguridad (RLS) de Supabase son las que impiden
// que alguien que no sea admin pueda escribir en la tabla de productos.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente "de servicio": solo se usa en rutas de API dentro del servidor
// (nunca llega al navegador) y es el que usa el panel de administrador
// para crear, editar o borrar productos y pedidos sin restricciones.
export function supabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
