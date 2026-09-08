"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Producto, Pedido } from "@/lib/types";
import AdminProductForm from "@/components/AdminProductForm";

export default function AdminPanelPage() {
  const [pestaña, setPestaña] = useState<"productos" | "pedidos">("productos");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  async function cargarProductos() {
    const res = await fetch("/api/admin/productos");
    setProductos(await res.json());
  }

  async function cargarPedidos() {
    const res = await fetch("/api/admin/pedidos");
    setPedidos(await res.json());
  }

  useEffect(() => {
    Promise.all([cargarProductos(), cargarPedidos()]).finally(() => setCargando(false));
  }, []);

  async function borrarProducto(id: string) {
    if (!confirm("¿Seguro que quieres borrar este producto?")) return;
    await fetch(`/api/admin/productos/${id}`, { method: "DELETE" });
    cargarProductos();
  }

  async function marcarPedido(id: string, estado: Pedido["estado"]) {
    await fetch(`/api/admin/pedidos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    cargarPedidos();
  }

  async function salir() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-700 text-crema">Panel de administrador</h1>
        <button onClick={salir} className="text-sm text-crema/60 hover:text-magenta">
          Cerrar sesión
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setPestaña("productos")}
          className={`rounded-full px-4 py-2 text-sm font-600 ${
            pestaña === "productos" ? "bg-menta text-noche" : "border border-white/15 text-crema/70"
          }`}
        >
          Productos
        </button>
        <button
          onClick={() => setPestaña("pedidos")}
          className={`relative rounded-full px-4 py-2 text-sm font-600 ${
            pestaña === "pedidos" ? "bg-menta text-noche" : "border border-white/15 text-crema/70"
          }`}
        >
          Pedidos
          {pedidosPendientes > 0 && (
            <span className="ml-2 rounded-full bg-arcade px-1.5 py-0.5 text-xs text-noche">
              {pedidosPendientes}
            </span>
          )}
        </button>
      </div>

      {cargando ? (
        <p className="mt-10 text-crema/50">Cargando…</p>
      ) : pestaña === "productos" ? (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.3fr]">
          <AdminProductForm
            key={editando?.id ?? "nuevo"}
            producto={editando ?? undefined}
            onGuardado={() => {
              setEditando(null);
              cargarProductos();
            }}
            onCancelar={editando ? () => setEditando(null) : undefined}
          />

          <div className="space-y-3">
            {productos.length === 0 && (
              <p className="text-sm text-crema/50">Todavía no has añadido ningún producto.</p>
            )}
            {productos.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-noche2 p-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-noche3">
                  {p.imagen_url && (
                    <Image src={p.imagen_url} alt="" fill className="object-cover" sizes="56px" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-600 text-crema">{p.nombre}</p>
                  <p className="text-xs text-crema/50">
                    {p.categoria} · {p.precio.toFixed(2)} € · stock {p.stock}
                  </p>
                </div>
                <button
                  onClick={() => setEditando(p)}
                  className="text-xs font-600 text-menta hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => borrarProducto(p.id)}
                  className="text-xs font-600 text-magenta hover:underline"
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {pedidos.length === 0 && <p className="text-sm text-crema/50">Todavía no hay pedidos.</p>}
          {pedidos.map((p) => (
            <div key={p.id} className="rounded-xl border border-white/10 bg-noche2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-600 text-crema">
                    {p.referencia} · {p.nombre_cliente}
                  </p>
                  <p className="text-xs text-crema/50">
                    {p.metodo_pago === "bizum" ? "Bizum" : "Tarjeta"} · {p.email_cliente} · {p.telefono}
                  </p>
                  <p className="text-xs text-crema/50">{p.direccion}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-700 text-crema">{p.total.toFixed(2)} €</p>
                  <span
                    className={`text-xs font-700 ${
                      p.estado === "pagado"
                        ? "text-menta"
                        : p.estado === "cancelado"
                        ? "text-crema/40"
                        : "text-arcade"
                    }`}
                  >
                    {p.estado}
                  </span>
                </div>
              </div>
              <ul className="mt-2 text-xs text-crema/60">
                {p.items.map((i, idx) => (
                  <li key={idx}>
                    {i.nombre} × {i.cantidad}
                  </li>
                ))}
              </ul>
              {p.estado === "pendiente" && p.metodo_pago === "bizum" && (
                <button
                  onClick={() => marcarPedido(p.id, "pagado")}
                  className="mt-3 rounded-full bg-menta px-4 py-1.5 text-xs font-700 text-noche"
                >
                  Marcar Bizum como recibido
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
