import {format as dateFormat} from 'date-fns';
import {facturaDOM, clienteDOM, vendedorDOM, descuentoDOM, turnoDOM} from '../utilities/selectors';

export default class Factura {
  constructor (numeroFactura, cliente, vendedor, turno) {
    this._numeroFactura = numeroFactura;
    Object.defineProperty(this, '_numeroFactura', {writable: false});
    facturaDOM.value = numeroFactura; // Freeze numeroFactura

    this.cliente = cliente;
    this.vendedor = vendedor;
    this._fecha = null;
    this._descuento = 0;
    this._turno = turno;
    this._anulada = false;
    this._condicionDePago = 'EFECTIVO';
    this.itemsFactura = [];
  }

  get numeroFactura () { return parseInt(this._numeroFactura); }
  get cliente () { return this._cliente; }
  get vendedor () { return this._vendedor; }
  get fechaStr () { return dateFormat(this._fecha, 'MM/dd/yyyy'); }
  get descuento () { return parseFloat(this._descuento); }
  get turno () { return this._turno; }
  get anulada () { return this._anulada; }
  get anuladaSQLite () { return this._anulada ? 1 : 0; }
  get condicionDePago () { return this._condicionDePago; }
  get precioTotal () { return this.itemsFactura.reduce((monto, item) => monto + item.precioTotal, 0); }

  set cliente (obj) {
    this._cliente = obj;
    clienteDOM.value = obj.NOMBRE;
  }

  set vendedor (obj) {
    this._vendedor = obj;
    vendedorDOM.value = obj.NOMBRE;
  }

  set descuento (value) {
    this._descuento = value;
    descuentoDOM.value = value;
    this.itemsFactura.forEach(item => item.updatePrice(this.descuento, this.condicionDePago));
  }

  set condicionDePago (value) {
    this._condicionDePago = value;
    this.itemsFactura.forEach(item => item.updatePrice(this.descuento, this.condicionDePago));
  }

  set turno (obj) {
    this._turno = obj;
    turnoDOM.value = obj.id; // TODO: WHAT FIELD ?
  }

  set anulada (bool) {
    this._anulada = bool;
  }

  toServerJsonAPI () {
    this._fecha = new Date(); // SEND WITH UPDATED DATE_TIME
    return {
      NUMERO_FACTURA: this.numeroFactura,
      FECHA_HORA: this.fechaStr, // UNIX EPOCH TIME
      DESCUENTO: this.descuento,
      CLIENTE_ID: this.cliente.id,
      TURNO_ID: this.turno.id, // TODO: MAKE TURNO
      ANULADA: this.anuladaSQLite
    };
  }

  async addItem (articuloData) {
    const articulo = this.itemsFactura.find(item => item.id === articuloData.id);
    if (articulo) {
      articulo.cantidad += 1;
    } else { // add new articulo
      const articulo = new ItemFactura(articuloData);
      this.itemsFactura.push(articulo);
    }

    // TODO: MAKE DOM NODES. PASS IN CONSTRUCTOR?
  }

  deleteItem (id) {
    const articulo = this.itemsFactura.find(item => item.id === id);
    this.itemsFactura = this.itemsFactura.filter(item => item.id === id);

    // TODO: DESTROY DOM NODES.
  }
}

class ItemFactura {
  constructor (articulo) {
    this._id = articulo.id;
    this._codigo = articulo.CODIGO;
    this._descripcion = articulo.DESCRIPCION;
    this._precioLista = articulo.PRECIO_LISTA;
    this._precioContado = articulo.PRECIO_CONTADO;
    this._stock = articulo.STOCK;
    this._rubro = articulo.RUBRO;
    this._marca = articulo.MARCA;
    this._cantidad = 1;
    this._descuentoIndividual = articulo.PROMO_BOOL ? articulo.DESCUENTO_PROMO : 0;
  }

  updatePrice (descuento = 0, condicionDePago = 'EFECTIVO') {
    const tipoPrecio = condicionDePago === 'EFECTIVO' ? 'precioContado' : 'precioLista';
    this._precioUnitario = this[tipoPrecio] * (1 - descuento / 100) * 100 * (1 - this.descuentoIndividual / 100) * 100;
  }

  get montoTotal () {
    return this._precioUnitario * this._cantidad;
  }

  toServerJsonAPI () {
  }
}
