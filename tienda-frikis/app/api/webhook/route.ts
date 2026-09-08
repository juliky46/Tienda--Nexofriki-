import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { enviarCorreoConfirmacionPago } from "@/lib/email";
import { Pedido } from "@/lib/types";

export async function POST(req: Request) {
  const firma = req.headers.get("stripe-signature");
  const cuerpo = await req.text();

  let evento: Stripe.Event;
  try {
    evento = stripe.webhooks.constructEvent(
      cuerpo,
      firma as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Firma de webhook inválida", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (evento.type === "checkout.session.completed") {
    const session = evento.data.object as Stripe.Checkout.Session;
    const pedidoId = session.metadata?.pedido_id;
    if (pedidoId) {
      const admin = supabaseAdmin();
      const { data: pedido } = await admin
        .from("pedidos")
        .update({ estado: "pagado" })
        .eq("id", pedidoId)
        .select()
        .single();

      if (pedido) {
        // Descuenta stock de cada producto del pedido.
        for (const item of (pedido as Pedido).items) {
          await admin.rpc("descontar_stock", {
            p_producto_id: item.producto_id,
            p_cantidad: item.cantidad,
          });
        }
        await enviarCorreoConfirmacionPago(pedido as Pedido);
      }
    }
  }

  return NextResponse.json({ recibido: true });
}
