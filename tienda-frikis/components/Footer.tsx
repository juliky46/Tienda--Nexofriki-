import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-noche2/60">
      <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-crema/60">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-base font-700 text-crema">
              NEXO<span className="text-menta">FRIKI</span>
            </p>
            <p className="mt-2 max-w-xs">
              Ropa, merchandising y figuras de tus universos favoritos. Piezas de dropshipping y de artesanos, en un mismo sitio.
            </p>
          </div>
          <div className="flex gap-10">
            <div>
              <p className="mb-2 font-600 text-crema">Tienda</p>
              <ul className="space-y-1">
                <li><Link href="/?categoria=ropa" className="hover:text-menta">Ropa</Link></li>
                <li><Link href="/?categoria=merchandising" className="hover:text-menta">Merchandising</Link></li>
                <li><Link href="/?categoria=figuras" className="hover:text-menta">Figuras</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-2 font-600 text-crema">Envíos y pago</p>
              <ul className="space-y-1">
                <li>Bizum</li>
                <li>Tarjeta</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-crema/40">
          © {new Date().getFullYear()} NEXOFRIKI. Todas las marcas y personajes mostrados pertenecen a sus respectivos propietarios.
        </p>
      </div>
    </footer>
  );
}
