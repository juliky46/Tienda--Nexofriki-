import { Resend } from "resend";
import { Pedido } from "./types";

const remitente = process.env.RESEND_FROM_EMAIL || "pedidos@resend.dev";
const correoTienda = process.env.EMAIL_NOTIFICACIONES;

function resendCliente() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function listaItems(pedido: Pedido) {
  return pedido.items
    .map((i) => `- ${i.nombre} × ${i.cantidad} — ${(i.precio * i.cantidad).toFixed(2)} €`)
    .join("\n");
}

export async function enviarCorreoInstruccionesBizum(pedido: Pedido, telefonoBizum: string) {
  const resend = resendCliente();
  if (!resend) return; // Sin RESEND_API_KEY configurada: se omite el envío, el pedido se crea igualmente.

  const asunto = `Instrucciones de pago Bizum — pedido ${pedido.referencia}`;
  const cuerpo = `Hola ${pedido.nombre_cliente},

Gracias por tu pedido en NEXOFRIKI. Para completarlo, envía un Bizum de ${pedido.total.toFixed(
    2
  )} € al ${telefonoBizum} indicando como concepto la referencia ${pedido.referencia}.

Tu pedido:
${listaItems(pedido)}

Total: ${pedido.total.toFixed(2)} €

En cuanto confirmemos el pago te enviaremos otro correo y prepararemos el envío a:
${pedido.direccion}

Un saludo,
NEXOFRIKI`;

  await resend.emails.send({ from: remitente, to: pedido.email_cliente, subject: asunto, text: cuerpo });

  if (correoTienda) {
    await resend.emails.send({
      from: remitente,
      to: correoTienda,
      subject: `Nuevo pedido por Bizum — ${pedido.referencia}`,
      text: `Nuevo pedido pendiente de confirmar:\n\n${cuerpo}\n\nTeléfono cliente: ${pedido.telefono}`,
    });
  }
}

export async function enviarCorreoConfirmacionPago(pedido: Pedido) {
  const resend = resendCliente();
  if (!resend) return;

  await resend.emails.send({
    from: remitente,
    to: pedido.email_cliente,
    subject: `Pago confirmado — pedido ${pedido.referencia}`,
    text: `Hola ${pedido.nombre_cliente},

Hemos recibido tu pago del pedido ${pedido.referencia}. Ya lo estamos preparando para enviarlo a:
${pedido.direccion}

Tu pedido:
${listaItems(pedido)}

Total: ${pedido.total.toFixed(2)} €

Gracias por tu compra,
NEXOFRIKI`,
  });

  if (correoTienda) {
    await resend.emails.send({
      from: remitente,
      to: correoTienda,
      subject: `Pedido pagado — ${pedido.referencia}`,
      text: `El pedido ${pedido.referencia} se ha pagado. Dirección de envío: ${pedido.direccion}. Teléfono: ${pedido.telefono}.`,
    });
  }
}
