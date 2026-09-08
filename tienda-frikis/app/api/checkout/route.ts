import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { generarReferencia } from "@/lib/referencia";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total, nombre, email, telefono, direccion } = body;

    if (!items?.length || !nombre || !email || !telefono || !direccion) {
      return NextResponse.json({ error: "Faltan datos del pedido" }, { status: 400 });
    }

    const referencia = generarReferencia();
    const admin = supabaseAdmin();

    const { data: pedido, error } = await admin
      .from("pedidos")
      .insert({
        items,
        total,
        metodo_pago: "tarjeta",
        estado: "pendiente",
        nombre_cliente: nombre,
        email_cliente: email,
        telefono,
        direccion,
        referencia,
      })
      .select()
      .single();

    if (error) throw error;

    const origen = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: items.map((i: any) => ({
        price_data: {
          currency: "eur",
          product_data: { name: i.nombre },
          unit_amount: Math.round(i.precio * 100),
        },
        quantity: i.cantidad,
      })),
      success_url: `${origen}/checkout/exito?ref=${referencia}&metodo=tarjeta`,
      cancel_url: `${origen}/checkout/cancelado`,
      metadata: { pedido_id: pedido.id, referencia },
    });

    await admin.from("pedidos").update({ stripe_session_id: session.id }).eq("id", pedido.id);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "No se pudo iniciar el pago" }, { status: 500 });
  }
}
