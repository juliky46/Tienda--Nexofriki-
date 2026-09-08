import { supabase } from "@/lib/supabase";
import { Producto } from "@/lib/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import AgregarAlCarrito from "./AgregarAlCarrito";

export const revalidate = 0;

const ORIGEN_LABEL: Record<Producto["origen"], string> = {
  dropshipping: "Envío directo (dropshipping)",
  artesano: "Hecho a mano por un artesano",
};

async function obtenerProducto(id: string) {
  const { data, error } = await supabase.from("productos").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Producto;
}

export default async function ProductoPage({ params }: { params: { id: string } }) {
  const producto = await obtenerProducto(params.id);
  if (!producto) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-noche2">
          {producto.imagen_url ? (
            <Image
              src={producto.imagen_url}
              alt={producto.nombre}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 90vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-crema/30">Sin imagen</div>
          )}
        </div>

        <div>
          <span className="clip-badge-inv inline-block bg-noche3 px-3 py-1 text-xs font-700 text-menta">
            {ORIGEN_LABEL[producto.origen]}
          </span>
          <h1 className="mt-4 font-display text-3xl font-700 text-crema">{producto.nombre}</h1>
          {producto.origen === "artesano" && producto.nombre_artesano && (
            <p className="mt-1 text-sm text-arcade">Creado por {producto.nombre_artesano}</p>
          )}
          <p className="mt-5 font-display text-2xl font-900 text-crema">
            {producto.precio.toFixed(2)} €
          </p>
          <p className="mt-5 whitespace-pre-line text-crema/70">{producto.descripcion}</p>

          <p className="mt-4 text-sm text-crema/50">
            {producto.stock > 0 ? `${producto.stock} unidades disponibles` : "Sin stock por ahora"}
          </p>

          <AgregarAlCarrito producto={producto} />
        </div>
      </div>
    </div>
  );
}
