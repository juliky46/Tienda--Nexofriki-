"use client";

import { useState } from "react";
import Image from "next/image";
import { Producto } from "@/lib/types";

const VACIO: Omit<Producto, "id"> = {
  nombre: "",
  descripcion: "",
  precio: 0,
  categoria: "ropa",
  origen: "dropshipping",
  nombre_artesano: "",
  imagen_url: null,
  stock: 0,
  destacado: false,
};

export default function AdminProductForm({
  producto,
  onGuardado,
  onCancelar,
}: {
  producto?: Producto;
  onGuardado: () => void;
  onCancelar?: () => void;
}) {
  const [form, setForm] = useState<Omit<Producto, "id">>(producto ?? VACIO);
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function actualizar<K extends keyof typeof form>(campo: K, valor: (typeof form)[K]) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function subirImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    setSubiendo(true);
    setError("");
    try {
      const data = new FormData();
data.append("archivo", archivo);

const res = await fetch("/api/admin/subir-imagen", {
  method: "POST",
  body: data
});

const texto = await res.text();

let json: any = {};

if (texto) {
  try {
    json = JSON.parse(texto);
  } catch {
    throw new Error("El servidor devolvió una respuesta no válida: " + texto);
  }
}

if (!res.ok) {
  throw new Error(json.error || "No se pudo subir la imagen");
}

if (!json.url) {
  throw new Error("La imagen se subió, pero el servidor no devolvió la URL");
}

actualizar("imagen_url", json.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubiendo(false);
    }
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      const endpoint = producto ? `/api/admin/productos/${producto.id}` : "/api/admin/productos";
      const metodo = producto ? "PUT" : "POST";
      const res = await fetch(endpoint, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo guardar el producto");
      }
      onGuardado();
      if (!producto) setForm(VACIO);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-4 rounded-2xl border border-white/10 bg-noche2 p-5">
      <h3 className="font-display text-base font-700 text-crema">
        {producto ? "Editar producto" : "Nuevo producto"}
      </h3>

      <div>
        <label className="mb-1 block text-xs font-600 text-crema/70">Foto</label>
        <div className="flex items-center gap-3">
          {form.imagen_url && (
            <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-noche3">
              <Image src={form.imagen_url} alt="" fill className="object-cover" sizes="64px" />
            </div>
          )}
          <input type="file" accept="image/*" onChange={subirImagen} className="text-xs text-crema/70" />
          {subiendo && <span className="text-xs text-menta">Subiendo…</span>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-600 text-crema/70">Nombre</label>
        <input
          required
          value={form.nombre}
          onChange={(e) => actualizar("nombre", e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-noche3 px-3 py-2 text-sm text-crema outline-none focus:border-menta"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-600 text-crema/70">Descripción</label>
        <textarea
          rows={3}
          value={form.descripcion}
          onChange={(e) => actualizar("descripcion", e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-noche3 px-3 py-2 text-sm text-crema outline-none focus:border-menta"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-600 text-crema/70">Precio (€)</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={form.precio}
            onChange={(e) => actualizar("precio", parseFloat(e.target.value))}
            className="w-full rounded-lg border border-white/15 bg-noche3 px-3 py-2 text-sm text-crema outline-none focus:border-menta"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-600 text-crema/70">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => actualizar("stock", parseInt(e.target.value || "0", 10))}
            className="w-full rounded-lg border border-white/15 bg-noche3 px-3 py-2 text-sm text-crema outline-none focus:border-menta"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-600 text-crema/70">Categoría</label>
          <select
            value={form.categoria}
            onChange={(e) => actualizar("categoria", e.target.value as Producto["categoria"])}
            className="w-full rounded-lg border border-white/15 bg-noche3 px-3 py-2 text-sm text-crema outline-none focus:border-menta"
          >
            <option value="ropa">Ropa</option>
            <option value="merchandising">Merchandising</option>
            <option value="figuras">Figuras</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-600 text-crema/70">Origen</label>
          <select
            value={form.origen}
            onChange={(e) => actualizar("origen", e.target.value as Producto["origen"])}
            className="w-full rounded-lg border border-white/15 bg-noche3 px-3 py-2 text-sm text-crema outline-none focus:border-menta"
          >
            <option value="dropshipping">Dropshipping</option>
            <option value="artesano">Artesano</option>
          </select>
        </div>
      </div>

      {form.origen === "artesano" && (
        <div>
          <label className="mb-1 block text-xs font-600 text-crema/70">Nombre del artesano</label>
          <input
            value={form.nombre_artesano ?? ""}
            onChange={(e) => actualizar("nombre_artesano", e.target.value)}
            className="w-full rounded-lg border border-white/15 bg-noche3 px-3 py-2 text-sm text-crema outline-none focus:border-menta"
          />
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-crema/80">
        <input
          type="checkbox"
          checked={form.destacado}
          onChange={(e) => actualizar("destacado", e.target.checked)}
        />
        Destacar en la portada
      </label>

      {error && <p className="text-sm text-magenta">{error}</p>}

      <div className="flex gap-2">
        <button
          disabled={guardando || subiendo}
          className="flex-1 rounded-full bg-magenta py-2.5 text-sm font-700 text-noche hover:bg-menta disabled:opacity-50"
        >
          {guardando ? "Guardando…" : "Guardar"}
        </button>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-full border border-white/15 px-4 text-sm text-crema/70"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
