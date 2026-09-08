export function generarReferencia() {
  const fecha = new Date();
  const parte = fecha.toISOString().slice(2, 10).replace(/-/g, "");
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NF-${parte}-${aleatorio}`;
}
