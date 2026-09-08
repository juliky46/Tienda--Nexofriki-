export type Categoria = "ropa" | "merchandising" | "figuras";

export type Origen = "dropshipping" | "artesano";

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number; // en euros
  categoria: Categoria;
  origen: Origen;
  nombre_artesano?: string | null;
  imagen_url: string | null;
  stock: number;
  destacado: boolean;
  creado_en?: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface Pedido {
  id: string;
  items: { producto_id: string; nombre: string; precio: number; cantidad: number }[];
  total: number;
  metodo_pago: "bizum" | "tarjeta";
  estado: "pendiente" | "pagado" | "cancelado";
  nombre_cliente: string;
  email_cliente: string;
  direccion: string;
  telefono: string;
  referencia: string;
  creado_en?: string;
}
