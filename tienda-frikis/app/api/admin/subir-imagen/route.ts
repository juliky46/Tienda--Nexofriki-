import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const formData = await req.formData();
  const archivo = formData.get("archivo") as File | null;
  if (!archivo) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });

  const admin = supabaseAdmin();
  const extension = archivo.name.split(".").pop() || "jpg";
  const nombreArchivo = `${randomUUID()}.${extension}`;

  const { error } = await admin.storage
    .from("productos")
    .upload(nombreArchivo, archivo, { contentType: archivo.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = admin.storage.from("productos").getPublicUrl(nombreArchivo);
  return NextResponse.json({ url: data.publicUrl });
}
