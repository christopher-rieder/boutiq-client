import {format as dateFormat} from 'date-fns';
import {facturaDOM, clienteDOM, vendedorDOM, descuentoDOM, turnoDOM, tbodyDOM} from '../utilities/selectors';
import {descuentoMax} from '../constants/bussinessConstants';

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
    let articulo = this.itemsFactura.find(item => item.id === articuloData.id);
    if (articulo) {
      articulo.cantidad += 1;
    } else { // add new articulo
      articulo = new ItemFactura(articuloData);
      this.itemsFactura.push(articulo);
      const markup = `
      <tr id=${'art' + articulo.id}>
        <td><input type='number' id=${'artCantidad' + articulo.id} value=${articulo.cantidad} min=0 /></td>
        <td>${articulo.codigo}</td>
        <td>${articulo.descripcion}</td>
        <td><input type='number' id=${'artPrecioUnitario' + articulo.id} value=${articulo.precioUnitario} min=0 /></td>
        <td id=${'artPrecioTotal' + articulo.id}>${articulo.precioTotal}</td>
        <td><input type='number' id=${'artDescuentoIndividual' + articulo.id} value=${articulo.descuentoIndividual} min=0 max=${descuentoMax} /></td>
      </tr>`;

      tbodyDOM.insertAdjacentHTML('beforeend', markup);

      document.querySelector('#artCantidad' + articulo.id).addEventListener('input', event => {
        articulo.cantidad = event.target.value;
        if (parseInt(event.target.value) === 0) {
          this.deleteItem(articulo.id);
        }
      });
      document.querySelector('#artPrecioUnitario' + articulo.id).addEventListener('input', event => {
        articulo.precioUnitario = event.target.value;
      });
      document.querySelector('#artDescuentoIndividual' + articulo.id).addEventListener('input', event => {
        articulo.descuentoIndividual = event.target.value;
      });
    }
  }

  deleteItem (id) {
    this.itemsFactura = this.itemsFactura.filter(item => item.id !== id);
    tbodyDOM.children['art' + id].remove();
    this.fullViewUpdate();
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
    this.updatePrice();
  }

  updatePrice (descuento = 0, condicionDePago = 'EFECTIVO') {
    const tipoPrecio = condicionDePago === 'EFECTIVO' ? '_precioContado' : '_precioLista';
    this._precioUnitario = Math.round(this[tipoPrecio] * (1 - descuento / 100) * (1 - this._descuentoIndividual / 100));
  }

  get id () { return this._id; }
  get cantidad () { return this._cantidad; }
  get codigo () { return this._codigo; }
  get descripcion () { return this._descripcion; }
  get precioUnitario () { return this._precioUnitario; }
  get descuentoIndividual () { return this._descuentoIndividual; }
  get precioTotal () { return this._precioUnitario * this._cantidad; }

  set cantidad (value) {
    this._cantidad = parseInt(value) >= 0 ? parseInt(value) : 0;
    document.querySelector('#artCantidad' + this.id).value = this._cantidad;
    document.querySelector('#artPrecioTotal' + this.id).textContent = this.precioTotal;
  }

  set precioUnitario (value) {
    this._precioUnitario = parseInt(value) >= 0 ? parseInt(value) : 0;
    document.querySelector('#artPrecioUnitario' + this.id).value = this._precioUnitario;
    document.querySelector('#artPrecioTotal' + this.id).textContent = this.precioTotal;
  }

  set descuentoIndividual (value) {
    console.log(value);
    // if (parseFloat(value) > descuentoMax) {
    //   value = descuentoMax;
    // }
    // if (parseFloat(value) < 0 || isNaN(parseFloat(value))) {
    //   value = 0;
    // }
    this._descuentoIndividual = (value);
    this.updatePrice();
    // document.querySelector('#artDescuentoIndividual' + this.id).value = value;
    document.querySelector('#artPrecioUnitario' + this.id).value = this._precioUnitario;
    document.querySelector('#artPrecioTotal' + this.id).textContent = this.precioTotal;
  }

  toServerJsonAPI () {
  }
}
