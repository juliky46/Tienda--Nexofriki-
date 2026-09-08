"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

const CATEGORIAS = [
  { slug: "ropa", nombre: "Ropa" },
  { slug: "merchandising", nombre: "Merchandising" },
  { slug: "figuras", nombre: "Figuras" },
];

export default function Header() {
  const { cantidadTotal, setAbierto } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-noche/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="clip-badge inline-flex h-9 w-9 items-center justify-center bg-magenta font-display text-lg font-900 text-noche">
            N
          </span>
          <span className="font-display text-lg font-700 tracking-tight text-crema">
            NEXO<span className="text-menta">FRIKI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {CATEGORIAS.map((c) => (
            <Link
              key={c.slug}
              href={`/?categoria=${c.slug}`}
              className="text-sm font-600 text-crema/80 transition hover:text-menta"
            >
              {c.nombre}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setAbierto(true)}
          className="relative flex items-center gap-2 rounded-full border border-white/15 bg-noche2 px-4 py-2 text-sm font-600 text-crema transition hover:border-menta/60"
          aria-label="Abrir carrito de compra"
        >
          Carrito
          {cantidadTotal > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-arcade px-1 text-xs font-700 text-noche">
              {cantidadTotal}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
