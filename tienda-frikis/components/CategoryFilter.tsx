"use client";

import Link from "next/link";
import { Categoria } from "@/lib/types";

const CATEGORIAS: { slug: Categoria | "todas"; nombre: string }[] = [
  { slug: "todas", nombre: "Todo" },
  { slug: "ropa", nombre: "Ropa" },
  { slug: "merchandising", nombre: "Merchandising" },
  { slug: "figuras", nombre: "Figuras" },
];

export default function CategoryFilter({ activa }: { activa: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIAS.map((c) => {
        const seleccionada = activa === c.slug || (activa === "" && c.slug === "todas");
        const href = c.slug === "todas" ? "/" : `/?categoria=${c.slug}`;
        return (
          <Link
            key={c.slug}
            href={href}
            className={`rounded-full border px-4 py-1.5 text-sm font-600 transition ${
              seleccionada
                ? "border-menta bg-menta text-noche"
                : "border-white/15 text-crema/70 hover:border-menta/50 hover:text-menta"
            }`}
          >
            {c.nombre}
          </Link>
        );
      })}
    </div>
  );
}
