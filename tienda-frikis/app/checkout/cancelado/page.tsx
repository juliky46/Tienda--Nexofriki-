import Link from "next/link";

export default function CanceladoPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="font-display text-2xl font-700 text-crema">Pago cancelado</h1>
      <p className="mt-4 text-crema/70">
        No te hemos cobrado nada. Tu carrito sigue guardado si quieres intentarlo de nuevo.
      </p>
      <Link
        href="/carrito"
        className="mt-8 inline-block rounded-full bg-magenta px-6 py-3 text-sm font-700 text-noche hover:bg-menta"
      >
        Volver al carrito
      </Link>
    </div>
  );
}
