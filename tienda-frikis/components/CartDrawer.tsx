"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, abierto, setAbierto, cambiarCantidad, quitar, total } = useCart();

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Cerrar carrito"
        onClick={() => setAbierto(false)}
        className="absolute inset-0 bg-noche/80 backdrop-blur-sm"
      />
      <div className="relative flex h-full w-full max-w-sm flex-col bg-noche2 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="font-display text-lg font-700 text-crema">Tu carrito</h2>
          <button
            onClick={() => setAbierto(false)}
            className="text-crema/60 transition hover:text-menta"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-crema/50">
              Aún no has añadido nada. Explora la tienda y encuentra algo que te encante.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.producto.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-noche3">
                    {item.producto.imagen_url && (
                      <Image
                        src={item.producto.imagen_url}
                        alt={item.producto.nombre}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-600 text-crema">{item.producto.nombre}</p>
                    <p className="text-xs text-crema/50">{item.producto.precio.toFixed(2)} €</p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        className="h-6 w-6 rounded bg-noche3 text-crema hover:text-menta"
                        onClick={() => cambiarCantidad(item.producto.id, item.cantidad - 1)}
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm">{item.cantidad}</span>
                      <button
                        className="h-6 w-6 rounded bg-noche3 text-crema hover:text-menta"
                        onClick={() => cambiarCantidad(item.producto.id, item.cantidad + 1)}
                      >
                        +
                      </button>
                      <button
                        className="ml-auto text-xs text-crema/40 hover:text-magenta"
                        onClick={() => quitar(item.producto.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-crema/60">Subtotal</span>
              <span className="font-700 text-crema">{total.toFixed(2)} €</span>
            </div>
            <Link
              href="/carrito"
              onClick={() => setAbierto(false)}
              className="block w-full rounded-full bg-magenta py-3 text-center text-sm font-700 text-noche transition hover:bg-menta"
            >
              Ir a pagar
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
