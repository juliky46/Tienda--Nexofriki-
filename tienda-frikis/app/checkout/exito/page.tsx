import Link from "next/link";

export default function ExitoPage({
  searchParams,
}: {
  searchParams: { ref?: string; metodo?: string };
}) {
  const esBizum = searchParams.metodo === "bizum";
  const telefonoBizum = process.env.BIZUM_TELEFONO || "600 000 000";

  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <span className="clip-badge-inv mx-auto inline-block bg-menta px-4 py-1.5 text-xs font-700 text-noche">
        Pedido recibido
      </span>
      <h1 className="mt-5 font-display text-2xl font-700 text-crema">
        {esBizum ? "Ya casi está" : "¡Gracias por tu compra!"}
      </h1>

      {esBizum ? (
        <div className="mt-5 space-y-3 text-crema/70">
          <p>
            Envía un Bizum de tu pedido al <strong className="text-crema">{telefonoBizum}</strong> indicando
            como concepto la referencia:
          </p>
          <p className="font-display text-lg font-700 text-menta">{searchParams.ref}</p>
          <p>Te hemos enviado las instrucciones también por correo. En cuanto confirmemos el pago, preparamos tu envío.</p>
        </div>
      ) : (
        <p className="mt-5 text-crema/70">
          Hemos confirmado tu pago. Referencia del pedido: <strong className="text-crema">{searchParams.ref}</strong>.
          Te avisaremos por correo cuando lo enviemos.
        </p>
      )}

      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-magenta px-6 py-3 text-sm font-700 text-noche hover:bg-menta"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
