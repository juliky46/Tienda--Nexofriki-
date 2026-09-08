import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { generarReferencia } from "@/lib/referencia";
import { enviarCorreoInstruccionesBizum } from "@/lib/email";
import { Pedido } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total, nombre, email, telefono, direccion } = body;

    if (!items?.length || !nombre || !email || !telefono || !direccion) {
      return NextResponse.json({ error: "Faltan datos del pedido" }, { status: 400 });
    }

    const referencia = generarReferencia();
    const admin = supabaseAdmin();

    const { data, error } = await admin
      .from("pedidos")
      .insert({
        items,
        total,
        metodo_pago: "bizum",
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

    const telefonoBizum = process.env.BIZUM_TELEFONO || "600 000 000";
    await enviarCorreoInstruccionesBizum(data as Pedido, telefonoBizum);

    return NextResponse.json({ referencia, telefonoBizum });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "No se pudo crear el pedido" }, { status: 500 });
  }
}
