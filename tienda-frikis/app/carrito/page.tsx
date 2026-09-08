"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CarritoPage() {
  const { items, cambiarCantidad, quitar, total, vaciar } = useCart();
  const router = useRouter();
  const [metodo, setMetodo] = useState<"bizum" | "tarjeta">("tarjeta");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  function actualizar(campo: keyof typeof datos, valor: string) {
    setDatos((d) => ({ ...d, [campo]: valor }));
  }

  async function pagar(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    setError("");
    setCargando(true);
    try {
      const endpoint = metodo === "tarjeta" ? "/api/checkout" : "/api/pedidos/bizum";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            producto_id: i.producto.id,
            nombre: i.producto.nombre,
            precio: i.producto.precio,
            cantidad: i.cantidad,
          })),
          total,
          ...datos,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo procesar el pedido");

      if (metodo === "tarjeta") {
        window.location.href = data.url; // redirige a Stripe Checkout
      } else {
        vaciar();
        router.push(`/checkout/exito?ref=${data.referencia}&metodo=bizum`);
      }
    } catch (err: any) {
      setError(err.message || "Ha ocurrido un error, inténtalo de nuevo");
    } finally {
      setCargando(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="font-display text-2xl font-700 text-crema">Tu carrito está vacío</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-magenta px-6 py-3 text-sm font-700 text-noche hover:bg-menta"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <h1 className="font-display text-2xl font-700 text-crema">Finalizar compra</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <form onSubmit={pagar} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-600 text-crema/80">Nombre completo</label>
            <input
              required
              value={datos.nombre}
              onChange={(e) => actualizar("nombre", e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-noche2 px-4 py-2.5 text-crema outline-none focus:border-menta"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-600 text-crema/80">Correo electrónico</label>
            <input
              required
              type="email"
              value={datos.email}
              onChange={(e) => actualizar("email", e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-noche2 px-4 py-2.5 text-crema outline-none focus:border-menta"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-600 text-crema/80">Teléfono</label>
            <input
              required
              value={datos.telefono}
              onChange={(e) => actualizar("telefono", e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-noche2 px-4 py-2.5 text-crema outline-none focus:border-menta"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-600 text-crema/80">Dirección de envío</label>
            <textarea
              required
              value={datos.direccion}
              onChange={(e) => actualizar("direccion", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-white/15 bg-noche2 px-4 py-2.5 text-crema outline-none focus:border-menta"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-600 text-crema/80">Método de pago</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMetodo("tarjeta")}
                className={`rounded-xl border px-4 py-3 text-sm font-700 transition ${
                  metodo === "tarjeta"
                    ? "border-menta bg-menta/10 text-menta"
                    : "border-white/15 text-crema/70"
                }`}
              >
                Tarjeta
              </button>
              <button
                type="button"
                onClick={() => setMetodo("bizum")}
                className={`rounded-xl border px-4 py-3 text-sm font-700 transition ${
                  metodo === "bizum"
                    ? "border-menta bg-menta/10 text-menta"
                    : "border-white/15 text-crema/70"
                }`}
              >
                Bizum
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-magenta">{error}</p>}

          <button
            disabled={cargando}
            className="w-full rounded-full bg-magenta py-3.5 text-sm font-700 text-noche transition hover:bg-menta disabled:opacity-50"
          >
            {cargando ? "Procesando…" : metodo === "tarjeta" ? "Pagar con tarjeta" : "Continuar con Bizum"}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-white/10 bg-noche2 p-5">
          <h2 className="font-display text-base font-700 text-crema">Tu pedido</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.producto.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-noche3">
                  {item.producto.imagen_url && (
                    <Image src={item.producto.imagen_url} alt={item.producto.nombre} fill className="object-cover" sizes="48px" />
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-600 text-crema">{item.producto.nombre}</p>
                  <p className="text-crema/50">
                    {item.cantidad} × {item.producto.precio.toFixed(2)} €
                  </p>
                </div>
                <button onClick={() => quitar(item.producto.id)} className="text-xs text-crema/40 hover:text-magenta">
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-crema/60">Total</span>
            <span className="font-display text-lg font-700 text-crema">{total.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
