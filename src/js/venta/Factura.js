import {format as dateFormat} from 'date-fns';
import {facturaDOM, clienteDOM, vendedorDOM, descuentoDOM, turnoDOM, tbodyDOM} from '../utilities/selectors';
import {descuentoMax} from '../constants/bussinessConstants';
import dialogs from '../utilities/dialogs';
import * as d3Format from 'd3-format';
const money = d3Format.format('($,.2f');

export default class Factura {
  constructor (numeroFactura, cliente, vendedor, turno) {
    this._numeroFactura = numeroFactura;
    Object.defineProperty(this, '_numeroFactura', {writable: false});
    facturaDOM.value = numeroFactura; // Freeze numeroFactura

    this.cliente = cliente;
    this.vendedor = vendedor;
    this._fecha = new Date();
    this._descuento = 0;
    this._turno = turno;
    this._anulada = false;
    this._tipoPago = {id: 1};
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
  get tipoPago () { return this._tipoPago; }
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
    this.itemsFactura.forEach(item => item.updatePrice());
  }

  set tipoPago (value) {
    this._tipoPago = value;
    this.itemsFactura.forEach(item => item.updatePrice());
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
      FECHA_HORA: this._fecha.getTime(), // UNIX EPOCH TIME
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
      articulo = new ItemFactura(articuloData, this);
      this.itemsFactura.push(articulo);
      const markup = `
      <tr id=${'art' + articulo.id}>
        <td class='table-cell-cantidad'><input type='number' id=${'artCantidad' + articulo.id} value=${articulo.cantidad} min=0 /></td>
        <td class='table-cell-codigo'>${articulo.codigo}</td>
        <td class='table-cell-descripcion'>${articulo.descripcion}</td>
        <td class='table-cell-stock ${articulo.stock < 0 ? 'low-stock' : ''}'>${articulo.stock}</td>
        <td class='table-cell-precioBase' id=${'artPrecioBase' + articulo.id}>${articulo.precioBase}</td>
        <td class='table-cell-precioUnitario'><input type='number' id=${'artPrecioUnitario' + articulo.id} value=${articulo.precioUnitario} min=0 /></td>
        <td class='table-cell-precioTotal' id=${'artPrecioTotal' + articulo.id}>${articulo.precioTotal}</td>
        <td class='table-cell-descuentoIndividual'><input type='number' id=${'artDescuentoIndividual' + articulo.id} value=${articulo.descuentoIndividual} min=0 max=${descuentoMax} /></td>
      </tr>`;

      tbodyDOM.insertAdjacentHTML('beforeend', markup);

      const confirmDialog = targetDOM => {
        dialogs.confirm(
          confirmed => {
            if (confirmed) {
              this.deleteItem(articulo.id);
            } else {
              targetDOM.value = 1;
            }
          }, // Callback
          'Quitar articulo de venta?', // Message text
          'Si', // Confirm text
          'No', // Cancel text
          {} // Additional options
        );
      };

      document.querySelector('#artCantidad' + articulo.id).addEventListener('input', event => {
        if (parseInt(event.target.value) === 0) {
          confirmDialog(event.target);
        }
        if (parseInt(event.target.value) > articulo.stock) {
          event.target.classList.add('RED-TEXT');
        }
        if (parseInt(event.target.value) <= articulo.stock) {
          event.target.classList.remove('RED-TEXT');
        }
        articulo.cantidad = event.target.value;
      });
      document.querySelector('#artPrecioUnitario' + articulo.id).addEventListener('input', event => {
        articulo.precioUnitario = event.target.value;
      });
      document.querySelector('#artDescuentoIndividual' + articulo.id).addEventListener('input', event => {
        articulo.descuentoIndividual = event.target.value;
      });

      articulo.updatePrice();
    }
  }

  deleteItem (id) {
    this.itemsFactura = this.itemsFactura.filter(item => item.id !== id);
    tbodyDOM.children['art' + id].remove();
    this.updateTotal();
  }

  updateTotal () {
    document.querySelector('#table-footer-total').textContent = money(this.precioTotal);
  }

  removeFromDOM () {
    tbodyDOM.innerHTML = '';
    document.querySelector('#table-footer-total').textContent = '';
    clienteDOM.value = '';
    vendedorDOM.value = '';
    descuentoDOM.value = '';
    turnoDOM.value = '';
  }
}

class ItemFactura {
  constructor (articulo, parent) {
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
    this._precioUnitario = articulo.PRECIO_CONTADO * (1 - articulo.DESCUENTO_PROMO / 100);
    this._parent = parent;
  }

  updatePrice (customPrice) {
    if (!customPrice) {
      this._precioUnitario = this.precioBase * (1 - this._parent.descuento / 100) * (1 - this._descuentoIndividual / 100);
      this._precioUnitario = parseFloat(this._precioUnitario);
    }
    document.querySelector('#artPrecioUnitario' + this.id).value = parseFloat(this.precioUnitario);
    document.querySelector('#artPrecioTotal' + this.id).textContent = money(this.precioTotal);
    document.querySelector('#artPrecioBase' + this.id).textContent = money(this.precioBase);
    this._parent.updateTotal();
  }

  get id () { return this._id; }
  get stock () { return this._stock; }
  get cantidad () { return this._cantidad; }
  get codigo () { return this._codigo; }
  get descripcion () { return this._descripcion; }
  get precioUnitario () { return this._precioUnitario; }
  get descuentoIndividual () { return this._descuentoIndividual; }
  get precioTotal () { return this._precioUnitario * this._cantidad; }
  get precioBase () {
    const tipoPrecio = this._parent.tipoPago.id === 1 ? '_precioContado' : '_precioLista';
    return this[tipoPrecio];
  }

  set cantidad (value) {
    this._cantidad = parseInt(value) >= 0 ? parseInt(value) : 0;
    document.querySelector('#artCantidad' + this.id).value = this._cantidad;
    if (parseInt(value) > this.stock) {
      document.querySelector('#artCantidad' + this.id).classList.add('RED-TEXT');
    }
    if (parseInt(value) <= this.stock) {
      document.querySelector('#artCantidad' + this.id).classList.remove('RED-TEXT');
    }
    this.updatePrice();
  }

  set precioUnitario (value) {
    this._precioUnitario = parseFloat(value) >= 0 ? parseFloat(value) : 0;
    this._descuentoIndividual = 100 - (this._precioUnitario / this.precioBase * (1 - this._parent.descuento / 100)) * 100;
    document.querySelector('#artDescuentoIndividual' + this.id).value = this._descuentoIndividual;
    this.updatePrice(true);
  }

  set descuentoIndividual (value) {
    this._descuentoIndividual = value;
    this.updatePrice();
  }

  toServerJsonAPI () {
    return {
      FACTURA_ID: this._parent.numeroFactura,
      CANTIDAD: this.cantidad,
      PRECIO_UNITARIO: this.precioUnitario,
      DESCUENTO: this.descuentoIndividual,
      ARTICULO_ID: this.id
    };
  }
}
