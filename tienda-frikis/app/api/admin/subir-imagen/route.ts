import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const archivo = formData.get("archivo") as File | null;
    if (!archivo) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });

    const admin = supabaseAdmin();
    const extension = archivo.name.split(".").pop() || "jpg";
    const nombreArchivo = `${randomUUID()}.${extension}`;

    const bytes = await archivo.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error } = await admin.storage
      .from("productos")
      .upload(nombreArchivo, buffer, { contentType: archivo.type, upsert: false });

    if (error) {
      console.error("Error subiendo a Supabase Storage:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
