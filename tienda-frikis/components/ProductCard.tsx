"use client";

import Link from "next/link";
import Image from "next/image";
import { Producto } from "@/lib/types";
import { useCart } from "@/context/CartContext";

const ORIGEN_LABEL: Record<Producto["origen"], string> = {
  dropshipping: "Envío directo",
  artesano: "Hecho a mano",
};

export default function ProductCard({ producto }: { producto: Producto }) {
  const { añadir } = useCart();
  const agotado = producto.stock <= 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-noche2 transition hover:border-menta/40">
      <Link href={`/producto/${producto.id}`} className="relative block aspect-square overflow-hidden bg-noche3">
        {producto.imagen_url ? (
          <Image
            src={producto.imagen_url}
            alt={producto.nombre}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 25vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-crema/30">Sin imagen</div>
        )}
        <span className="clip-badge absolute left-0 top-0 bg-noche/90 px-3 py-1 text-xs font-600 text-crema/80">
          {ORIGEN_LABEL[producto.origen]}
        </span>
        {agotado && (
          <span className="absolute inset-0 flex items-center justify-center bg-noche/70 font-display text-sm font-700 text-crema">
            Agotado
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/producto/${producto.id}`}>
          <h3 className="font-600 text-crema hover:text-menta">{producto.nombre}</h3>
        </Link>
        {producto.origen === "artesano" && producto.nombre_artesano && (
          <p className="text-xs text-arcade">por {producto.nombre_artesano}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-700 text-crema">
            {producto.precio.toFixed(2)} €
          </span>
          <button
            disabled={agotado}
            onClick={() => añadir(producto)}
            className="rounded-full bg-magenta px-4 py-2 text-xs font-700 text-noche transition hover:bg-menta disabled:cursor-not-allowed disabled:bg-noche3 disabled:text-crema/30"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
