export default class Articulo {
  constructor ({id, CODIGO, DESCRIPCION, PRECIO_LISTA, PRECIO_CONTADO, PRECIO_COSTO, STOCK, RUBRO_ID, MARCA_ID, PROMO_BOOL, DESCUENTO_PROMO}) {
    this.id = id;
    this.codigo = CODIGO;
    this.descripcion = DESCRIPCION;
    this.precioLista = PRECIO_LISTA;
    this.precioContado = PRECIO_CONTADO;
    this.precioCosto = PRECIO_COSTO;
    this.stock = STOCK;
    this.rubro = RUBRO_ID;
    this.marca = MARCA_ID;
    this.promo = PROMO_BOOL;
    this.descuento = DESCUENTO_PROMO;
  }
}
