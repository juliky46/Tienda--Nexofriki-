import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <h1 className="font-display text-3xl font-900 text-crema">404</h1>
      <p className="mt-3 text-crema/70">No hemos encontrado esa página.</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-magenta px-6 py-3 text-sm font-700 text-noche hover:bg-menta"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
