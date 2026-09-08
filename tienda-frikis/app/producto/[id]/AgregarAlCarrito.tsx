"use client";

import { useState } from "react";
import { Producto } from "@/lib/types";
import { useCart } from "@/context/CartContext";

export default function AgregarAlCarrito({ producto }: { producto: Producto }) {
  const { añadir } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const agotado = producto.stock <= 0;

  return (
    <div className="mt-6 flex items-center gap-3">
      <div className="flex items-center rounded-full border border-white/15">
        <button
          className="px-3 py-2 text-crema hover:text-menta"
          onClick={() => setCantidad((c) => Math.max(1, c - 1))}
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{cantidad}</span>
        <button
          className="px-3 py-2 text-crema hover:text-menta"
          onClick={() => setCantidad((c) => Math.min(producto.stock || 99, c + 1))}
        >
          +
        </button>
      </div>
      <button
        disabled={agotado}
        onClick={() => añadir(producto, cantidad)}
        className="rounded-full bg-magenta px-6 py-3 text-sm font-700 text-noche transition hover:bg-menta disabled:cursor-not-allowed disabled:bg-noche3 disabled:text-crema/30"
      >
        {agotado ? "Agotado" : "Añadir al carrito"}
      </button>
    </div>
  );
}
