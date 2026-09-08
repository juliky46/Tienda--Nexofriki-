import { supabase } from "@/lib/supabase";
import { Producto } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";

export const revalidate = 0;

async function obtenerProductos(categoria?: string) {
  let query = supabase.from("productos").select("*").order("creado_en", { ascending: false });
  if (categoria && categoria !== "todas") query = query.eq("categoria", categoria);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return (data ?? []) as Producto[];
}

export default async function Home({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const categoria = searchParams.categoria ?? "";
  const productos = await obtenerProductos(categoria);
  const destacados = productos.filter((p) => p.destacado).slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="clip-badge-inv inline-block bg-noche3 px-4 py-1.5 text-xs font-700 text-menta">
              Ropa · merchandising · figuras
            </span>
            <h1 className="mt-5 font-display text-4xl font-900 leading-[1.05] text-crema md:text-5xl">
              Lleva tus universos
              <br />
              <span className="text-magenta">favoritos</span> contigo
            </h1>
            <p className="mt-5 max-w-md text-crema/70">
              Piezas seleccionadas de dropshipping y creaciones únicas de artesanos independientes,
              todo en una misma tienda. Sin réplicas de mala calidad, sin esperas eternas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#catalogo"
                className="rounded-full bg-magenta px-6 py-3 text-sm font-700 text-noche transition hover:bg-menta"
              >
                Ver catálogo
              </a>
              <a
                href="/?categoria=figuras"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-700 text-crema transition hover:border-menta/60"
              >
                Descubre las figuras
              </a>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-magenta/30 via-noche2 to-menta/20" />
            <div className="absolute inset-6 rounded-3xl border border-white/10 bg-noche2/80 backdrop-blur" />
            <div className="absolute left-8 top-8 h-16 w-16 rounded-full bg-arcade/90" />
            <div className="absolute bottom-10 right-8 h-24 w-24 rotate-12 rounded-2xl bg-menta/80" />
            <div className="absolute bottom-24 left-12 h-10 w-10 rounded-full bg-magenta" />
          </div>
        </div>
      </section>

      {destacados.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="font-display text-xl font-700 text-crema">Destacados de la semana</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3">
            {destacados.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </section>
      )}

      <section id="catalogo" className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-700 text-crema">Catálogo</h2>
          <CategoryFilter activa={categoria} />
        </div>

        {productos.length === 0 ? (
          <p className="mt-16 text-center text-crema/50">
            Todavía no hay productos publicados. Entra en el panel de administrador para añadir el primero.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
