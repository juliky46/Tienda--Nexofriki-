import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { enviarCorreoConfirmacionPago } from "@/lib/email";
import { Pedido } from "@/lib/types";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { estado } = await req.json();
  const admin = supabaseAdmin();

  const { data: pedido, error } = await admin
    .from("pedidos")
    .update({ estado })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (estado === "pagado") {
    for (const item of (pedido as Pedido).items) {
      await admin.rpc("descontar_stock", {
        p_producto_id: item.producto_id,
        p_cantidad: item.cantidad,
      });
    }
    await enviarCorreoConfirmacionPago(pedido as Pedido);
  }

  return NextResponse.json(pedido);
}
