import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const admin = supabaseAdmin();

    const { data, error } = await admin
      .from("productos")
      .select("*")
      .order("creado_en", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido"
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Producto recibido:", body);

    const admin = supabaseAdmin();

    const { data, error } = await admin
      .from("productos")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Error de Supabase:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en POST productos:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al guardar el producto"
      },
      { status: 500 }
    );
  }
}q
