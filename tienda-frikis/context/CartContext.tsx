"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Producto, ItemCarrito } from "@/lib/types";

interface CartContextType {
  items: ItemCarrito[];
  añadir: (producto: Producto, cantidad?: number) => void;
  quitar: (productoId: string) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  vaciar: () => void;
  total: number;
  cantidadTotal: number;
  abierto: boolean;
  setAbierto: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "tienda-frikis-carrito";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) setItems(JSON.parse(guardado));
    } catch {
      // localStorage no disponible: seguimos con carrito vacío
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, cargado]);

  function añadir(producto: Producto, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find((i) => i.producto.id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock || 99) }
            : i
        );
      }
      return [...prev, { producto, cantidad }];
    });
    setAbierto(true);
  }

  function quitar(productoId: string) {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }

  function cambiarCantidad(productoId: string, cantidad: number) {
    if (cantidad <= 0) return quitar(productoId);
    setItems((prev) =>
      prev.map((i) => (i.producto.id === productoId ? { ...i, cantidad } : i))
    );
  }

  function vaciar() {
    setItems([]);
  }

  const total = items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, añadir, quitar, cambiarCantidad, vaciar, total, cantidadTotal, abierto, setAbierto }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
