# NEXOFRIKI — tienda de ropa, merchandising y figuras

Guía paso a paso para dejar la tienda funcionando, aunque no hayas programado nunca.
Sigue los pasos en orden, sin saltarte ninguno.

## Lo que vas a montar

- Una tienda online (catálogo, carrito, pago con Bizum o tarjeta).
- Un panel de administrador privado en `/admin` desde el que añades, editas
  y borras productos (con foto) desde el móvil, y marcas los pedidos de
  Bizum como pagados.
- Todo gratis para empezar (Supabase, Vercel y Resend tienen planes gratuitos
  de sobra para una tienda pequeña; Stripe solo cobra comisión cuando vendes).

---

## Paso 1: crear la base de datos (Supabase)

1. Ve a [supabase.com](https://supabase.com), crea una cuenta gratis y pulsa
   **New project**. Ponle el nombre que quieras y espera un par de minutos a
   que se cree.
2. En el menú de la izquierda entra en **SQL Editor** → **New query**.
3. Abre el archivo `supabase-schema.sql` de este proyecto, copia todo su
   contenido, pégalo ahí y pulsa **Run**. Esto crea las tablas de productos
   y pedidos.
4. Ve a **Project Settings** → **API**. Ahí tienes tres datos que necesitarás
   luego: **Project URL**, **anon public key** y **service_role key**
   (esta última no la compartas con nadie).

## Paso 2: crear la cuenta de Stripe (pago con tarjeta)

1. Crea una cuenta en [stripe.com](https://stripe.com).
2. En el panel, activa el **modo de prueba** (arriba a la derecha) mientras
   haces pruebas. En **Developers → API keys** copia la **Secret key**.
3. El **Webhook secret** lo configuras al final, cuando ya tengas la tienda
   publicada en una URL real (paso 5), porque Stripe necesita esa URL.

## Paso 3: correos automáticos (opcional pero recomendado)

1. Crea una cuenta gratis en [resend.com](https://resend.com).
2. Genera una **API key** en su panel.
3. Si no tienes un dominio propio verificado en Resend, puedes dejar
   `RESEND_FROM_EMAIL` sin rellenar: se usará una dirección de pruebas de
   Resend. Si quieres que los correos salgan desde tu propio dominio
   (por ejemplo `pedidos@tutienda.com`), verifícalo en Resend y ponlo ahí.
4. Si no configuras Resend, la tienda funciona igual, simplemente no se
   enviarán los correos de confirmación (los pedidos se seguirán viendo en
   el panel de administrador).

## Paso 4: subir el código a GitHub

1. Crea una cuenta en [github.com](https://github.com) si no tienes una.
2. Crea un repositorio nuevo (puede ser privado) y sube esta carpeta entera
   (todos los archivos que te he pasado).

## Paso 5: publicar la tienda (Vercel)

1. Crea una cuenta gratis en [vercel.com](https://vercel.com) e inicia
   sesión con tu cuenta de GitHub.
2. Pulsa **Add New → Project** y elige el repositorio que acabas de subir.
3. Antes de darle a "Deploy", abre la sección **Environment Variables** y
   añade todas las variables del archivo `.env.example` con tus propios
   valores (los de Supabase del paso 1, la contraseña de administrador que
   tú elijas, la clave de Stripe del paso 2, etc.). `ADMIN_SESSION_SECRET`
   puede ser cualquier texto largo inventado, por ejemplo
   `nf-9k2m1x7v-secreto-2026`.
4. Pulsa **Deploy** y espera unos minutos. Al terminar te da una URL como
   `https://nexofriki.vercel.app` — esa es tu tienda ya online.
5. Vuelve a las variables de entorno del proyecto en Vercel y actualiza
   `NEXT_PUBLIC_SITE_URL` con esa URL real. Vuelve a desplegar (Vercel →
   pestaña Deployments → botón Redeploy) para que se aplique.

## Paso 6: activar el webhook de Stripe

1. En el panel de Stripe, ve a **Developers → Webhooks → Add endpoint**.
2. Como URL pon: `https://TU-DOMINIO.vercel.app/api/webhook`.
3. En eventos a escuchar, añade `checkout.session.completed`.
4. Copia el **Signing secret** que te da y ponlo en Vercel como
   `STRIPE_WEBHOOK_SECRET` (Project Settings → Environment Variables) y
   vuelve a desplegar.
5. Cuando quieras cobrar de verdad (no solo pruebas), activa el modo
   producción en Stripe y repite este paso con las claves "live".

## Paso 7: entrar en el panel de administrador y añadir productos

1. Ve a `https://TU-DOMINIO.vercel.app/admin` e introduce la contraseña que
   pusiste en `ADMIN_PASSWORD`.
2. En la pestaña **Productos**, rellena el formulario: sube una foto desde
   la galería del móvil, pon nombre, descripción, precio, stock, categoría
   (ropa / merchandising / figuras) y si es de dropshipping o de un
   artesano (en este caso puedes poner su nombre). Pulsa **Guardar**.
3. El producto aparece al momento en la tienda pública.
4. En la pestaña **Pedidos** verás todos los pedidos. Los pagados con
   tarjeta se marcan solos como "pagado" en cuanto Stripe confirma el
   cobro. Los pagados por Bizum los tienes que marcar tú a mano cuando
   recibas el Bizum en tu móvil, pulsando "Marcar Bizum como recibido"
   (esto descuenta el stock automáticamente y avisa al cliente por correo).

---

## Probar en tu ordenador antes de publicar (opcional)

Si tienes Node.js instalado:

```bash
npm install
cp .env.example .env.local   # y rellena las variables
npm run dev
```

Abre `http://localhost:3000`.

## Estructura del proyecto

- `app/` — páginas de la tienda, del carrito, del checkout y del panel.
- `components/` — piezas reutilizables (cabecera, tarjetas de producto, carrito, formulario de admin).
- `lib/` — conexión con Supabase y Stripe, envío de correos.
- `supabase-schema.sql` — script para crear las tablas la primera vez.

## Cambiar el nombre, los colores o los textos

- El nombre "NEXOFRIKI" aparece en `components/Header.tsx`, `components/Footer.tsx` y `app/layout.tsx`.
- Los colores están centralizados en `tailwind.config.ts` (magenta, menta, arcade, noche).
- Los textos de la portada están en `app/page.tsx`.
