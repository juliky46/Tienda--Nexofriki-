-- Ejecuta este script en Supabase: panel del proyecto -> SQL Editor -> New query -> pega y dale a "Run".

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text not null default '',
  precio numeric(10,2) not null default 0,
  categoria text not null check (categoria in ('ropa', 'merchandising', 'figuras')),
  origen text not null check (origen in ('dropshipping', 'artesano')),
  nombre_artesano text,
  imagen_url text,
  stock integer not null default 0,
  destacado boolean not null default false,
  creado_en timestamptz not null default now()
);

create table if not exists pedidos (
  id uuid primary key default gen_random_uuid(),
  items jsonb not null,
  total numeric(10,2) not null,
  metodo_pago text not null check (metodo_pago in ('bizum', 'tarjeta')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'pagado', 'cancelado')),
  nombre_cliente text not null,
  email_cliente text not null,
  direccion text not null,
  telefono text not null,
  referencia text not null,
  stripe_session_id text,
  creado_en timestamptz not null default now()
);

-- Row Level Security: cualquiera puede LEER productos (es la tienda pública),
-- pero solo el panel de administrador (que usa la clave "service role" desde
-- el servidor, nunca desde el navegador) puede crear, editar o borrar.
alter table productos enable row level security;
create policy "Cualquiera puede ver productos" on productos for select using (true);

alter table pedidos enable row level security;
create policy "Cualquiera puede crear un pedido" on pedidos for insert with check (true);
-- No hay política de "select"/"update" pública: solo el servidor (service role) puede leer o actualizar pedidos.

-- Descuenta stock de un producto cuando se confirma el pago de un pedido.
create or replace function descontar_stock(p_producto_id uuid, p_cantidad integer)
returns void as $$
begin
  update productos
  set stock = greatest(stock - p_cantidad, 0)
  where id = p_producto_id;
end;
$$ language plpgsql security definer;

-- Bucket de almacenamiento para las fotos de producto.
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

create policy "Lectura pública de imágenes de productos"
on storage.objects for select
using (bucket_id = 'productos');
