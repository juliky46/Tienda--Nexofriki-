"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "No se pudo iniciar sesión");
      }
      router.push("/admin/panel");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm items-center px-5">
      <form onSubmit={entrar} className="w-full space-y-4">
        <h1 className="font-display text-xl font-700 text-crema">Panel de administrador</h1>
        <input
          type="password"
          required
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-noche2 px-4 py-2.5 text-crema outline-none focus:border-menta"
        />
        {error && <p className="text-sm text-magenta">{error}</p>}
        <button
          disabled={cargando}
          className="w-full rounded-full bg-magenta py-3 text-sm font-700 text-noche hover:bg-menta disabled:opacity-50"
        >
          {cargando ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
