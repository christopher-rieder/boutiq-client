import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import {format as dateFormat} from 'date-fns';
import {Input, InputText} from '../components/inputs';
import {errorShakeEffect} from '../components/effects';
import {condicionesPago, descuentoMax} from '../constants/bussinessConstants';
import options from './gridOptions';
import '../vendor/jquery-global.js';
import '../vendor/jquery-ui-1.11.3.min.js';
import '../vendor/jquery.event.drag-2.3.0';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
require('slickgrid/slick.core.js');
require('slickgrid/slick.grid.js');
require('slickgrid/slick.formatters.js');
require('slickgrid/slick.editors.js');
require('slickgrid/plugins/slick.rowselectionmodel.js');
require('slickgrid/slick.dataview.js');
let audioError = require('../../resources/audio/error.wav');
let audioOk = require('../../resources/audio/ok.wav');

class Venta extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentNroFactura: 0,
      cliente: {},
      vendedor: {},
      turno: {},
      observaciones: '',
      codigo: '',
      condicionPago: 'EFECTIVO',
      descuento: ''
    };

    this.codigoInput = React.createRef();
    this.descuentoInput = React.createRef();

    this.handleObservaciones = this.handleObservaciones.bind(this);
    this.handleCodigo = this.handleCodigo.bind(this);
    this.handleDescuento = this.handleDescuento.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addItem = this.addItem.bind(this);
    this.handleCondicionPago = this.handleCondicionPago.bind(this);
  }

  handleObservaciones (event) { this.setState({ observaciones: event.target.value }); }
  handleCodigo (event) { const codigo = event.target.value; this.setState({ codigo }); }

  handleDescuento (event) {
    let descuento = event.target.value;
    this.setState(prevState => {
      if (/^[1-9]\d*\.$/.test(descuento)) {
        return {descuento}; // Allow ending in dot without processing, for floats numbers.
      } else if (/^[1-9]\d*\.?\d*$/.test(descuento) || descuento === '') { // valid positive float
        descuento = parseFloat(descuento) || '';
        if (descuento > descuentoMax) {
          descuento = descuentoMax;
          errorShakeEffect(this.descuentoInput.current);
          // Toast(descuentoMax es el limite maximo);
        }
        updateAllPrices(descuento, this.state.condicionPago);
        return {descuento};
      } else {
        errorShakeEffect(this.descuentoInput.current);
        updateAllPrices(prevState.descuento, this.state.condicionPago);
        return prevState;
      }
    });
  }

  handleCondicionPago (event) {
    this.setState({condicionPago: event.target.value});
    updateAllPrices(this.state.descuento, event.target.value);
  }

  async onSubmit (event) {
    event.preventDefault();
    // TODO: POST DATA TO API AFTER CONFIRMATION AND VALIDATION
    // TODO: VALIDATIONS
    // TODO: make confirmation stage
    // TODO: inform user
    // TODO: CALL SUBMISSIONS

    let descuento = parseFloat(this.state.descuento) || 0;

    let factura = {
      NUMERO_FACTURA: this.state.currentNroFactura,
      FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
      DESCUENTO: descuento,
      CLIENTE_ID: this.state.cliente.id,
      TURNO_ID: 0, // TODO: MAKE TURNO
      ANULADA: 0 // FIXME: SQLITE BOOLEANS... NOT EXISTENT
    };

    const facturaId = await databaseWrite.postFactura(factura);

    window.dataSet.forEach(({id, CANTIDAD, PRECIO_UNITARIO, DESCUENTO}) => {
      let item = {CANTIDAD, PRECIO_UNITARIO, DESCUENTO};
      item.ARTICULO_ID = id;
      item.FACTURA_ID = facturaId;
      item.DESCUENTO = DESCUENTO || 0;
      databaseWrite.postItemFactura(item);
    });

    const monto = window.dataSet.reduce((monto, item) => monto + item.PRECIO_UNITARIO * item.CANTIDAD, 0);

    if (this.state.condicionPago === 'EFECTIVO') {
      const pago = {
        FACTURA_ID: facturaId,
        MONTO: monto,
        TIPO_PAGO_ID: condicionesPago[this.state.condicionPago],
        ESTADO: 'PAGADO'
      };
      const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
      console.log(pagoId);
    } else {
      const pago = {
        FACTURA_ID: facturaId,
        MONTO: monto,
        TIPO_PAGO_ID: condicionesPago[this.state.condicionPago],
        ESTADO: 'PENDIENTE'
      };
      const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
      console.log(pagoId);
    }

    // TODO: actualizacion de STOCK luego de que toda la transaccion fue exitosa.

    // TODO: AFTER FINISHING REFRESH CURRENT NUMERO FACTURA, REFRESH INTERFACE
  }

  componentDidMount () {
    databaseRead.getNewNumeroFactura().then((currentNroFactura) => this.setState({currentNroFactura}));
    databaseRead.getClienteById(1).then((cliente) => this.setState({cliente})); // FIXME: DA WARNING EN REACT. PORQUE?
    databaseRead.getVendedorById(1).then((vendedor) => this.setState({vendedor})); // FIXME: DA WARNING EN REACT. PORQUE?
    // TODO: get turno
    this.codigoInput.current.focus();
    setTimeout(e => addVentaItem('ZH2932030828'), 100);
    setTimeout(e => addVentaItem('5985561826014'), 200);
    setTimeout(e => addVentaItem('4883803077006'), 300);
    setTimeout(e => addVentaItem('4883803077006'), 1000);
  }

  getDate () {
    return dateFormat(new Date(), 'MM/dd/yyyy');
  }

  async addItem (event) { // ZH2932030828
    let boolAdded = await addVentaItem(this.state.codigo);
    this.setState({codigo: ''});
    this.codigoInput.current.focus();
    if (boolAdded) {
      // TODO: USER POSITIVE FEEDBACK. TOAST?
      var aud = new window.Audio(audioOk);
      aud.play();
    } else {
      errorShakeEffect(this.codigoInput.current);
      var aud2 = new window.Audio(audioError);
      aud2.play();
    }
  }

  /*
async function selectClient (nro) {
  // TODO: SELECT A DIFFERENT CLIENT
}

function addPago () {
  // TODO: add pagos
  // TODO: VALIDATIONS
}

function processSeña () {
  // TODO: process seña stuff
}

function articuloSearchFunctionality () {
  // TODO: handle the selection and search of articulos
}
  */

  render () {
    return (
      <div>
        <form onSubmit={this.onSubmit} className='venta' id='venta'>
          <div className='panel'>
            <Input context='venta' disabled tipo='factura' value={this.state.currentNroFactura} />
            <Input context='venta' tipo='cliente' value={this.state.cliente.NOMBRE} />
          </div>
          <div className='panel'>
            <div>
              <label htmlFor='venta-condicion-de-pago'>Condicion de pago</label>
              <select value={this.state.condicionPago} name='venta-condicion-de-pago' id='venta-condicion-de-pago' onChange={this.handleCondicionPago}>
                {Object.keys(condicionesPago).map((condicion, i) => <option key={i} value={condicion}>{condicion}</option>)}
              </select>
            </div>
            <InputText context='venta' tipo='descuento' value={this.state.descuento} onChange={this.handleDescuento} ref={this.descuentoInput} />
          </div>
          <div className='panel'>
            <InputText context='venta' tipo='codigo' value={this.state.codigo} onChange={this.handleCodigo} ref={this.codigoInput} />
            <button className='codigo-search' onClick={this.addItem}>BUTTON</button>
          </div>
          <div className='panel'>
            <Input context='venta' tipo='observaciones' value={this.state.observaciones} onChange={this.handleObservaciones} />
          </div>
          <div id='myGrid' />
          <div className='panel'>
            <Input context='venta' disabled tipo='vendedor' value={this.state.vendedor.NOMBRE} />
            <Input context='venta' disabled tipo='turno' value={this.state.turno} />
            <Input context='venta' disabled tipo='fecha' value={this.getDate()} />
          </div>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<Venta ref={(ventaApp) => { window.ventaApp = ventaApp; }} />, document.getElementById('app'));

// GRID STUFF
// VARIABLE DEFINITIONS FOR SLICKGRID TABLE
window.dataView = {}; // FIXME: TOO HACKY
window.grid = {}; // FIXME: TOO HACKY
window.dataSet = []; // FIXME: TOO HACKY

// TODO: read column preferences from a configuration file, persist this preferences
// COLUMNS DEFINITIONS
let columns = [
  {
    id: 'CANTIDAD',
    name: 'cantidad',
    field: 'CANTIDAD',
    minWidth: 60,
    editor: window.Slick.Editors.Text,
    cssClass: 'cell-title'
  },
  {
    id: 'CODIGO',
    name: 'codigo',
    field: 'CODIGO',
    minWidth: 120,
    cssClass: 'cell-title'
  },
  {
    id: 'DESCRIPCION',
    name: 'Descripcion',
    field: 'DESCRIPCION',
    minWidth: 300,
    cssClass: 'cell-title'
  },
  {
    id: 'PRECIO_UNITARIO',
    name: '$ Unit',
    field: 'PRECIO_UNITARIO',
    minWidth: 80,
    editor: window.Slick.Editors.Text,
    cssClass: 'cell-title'
  },
  {
    id: 'PRECIO_TOTAL',
    name: '$ Total',
    field: 'PRECIO_TOTAL',
    minWidth: 80,
    cssClass: 'cell-title'
  },
  {
    id: 'DESCUENTO',
    name: 'Descuento',
    field: 'DESCUENTO',
    minWidth: 80,
    editor: window.Slick.Editors.Text,
    cssClass: 'cell-title'
  }
];

window.dataView = new window.Slick.Data.DataView();
window.grid = new window.Slick.Grid('#myGrid', window.dataView, columns, options);
window.grid.setSelectionModel(new window.Slick.RowSelectionModel());

// wire up model events to drive the grid
// !! both dataView.onRowCountChanged and dataView.onRowsChanged MUST be wired to correctly update the grid
// see Issue#91
window.dataView.onRowCountChanged.subscribe(function (e, args) {
  window.grid.updateRowCount();
  window.grid.render();
});

window.dataView.onRowsChanged.subscribe(function (e, args) {
  window.grid.invalidateRows(args.rows);
  window.grid.render();
});

window.grid.onCellChange.subscribe(function (event, activeCell) {
  updateArticulo(activeCell.item, window.ventaApp.state.descuento, window.ventaApp.state.condicionPago);
});

window.grid.init();
// initialize the model after all the events have been hooked up
window.$('#gridContainer').resizable();

async function addVentaItem (codigo) {
  let articulo = window.dataSet.find(e => e.CODIGO === codigo);

  if (articulo) {
    articulo.CANTIDAD += 1;
  } else {
    if (!codigo) return false;
    articulo = await databaseRead.getArticuloByCodigo(codigo);
    if (!articulo) return false;
    articulo.CANTIDAD = 1;
    window.dataSet.push(articulo);
    window.dataView.beginUpdate();
    window.dataView.setItems(window.dataSet);
    window.dataView.endUpdate();
  }

  updateArticulo(articulo, window.ventaApp.state.descuento, window.ventaApp.state.condicionPago);
  return true;
}

function updateArticulo (articulo, descuento = 0, condicion = 'EFECTIVO') {
  const tipoPrecio = condicion === 'EFECTIVO' ? 'PRECIO_CONTADO' : 'PRECIO_LISTA';

  articulo.PRECIO_UNITARIO = articulo[tipoPrecio] * (100 - descuento) / 100;
  if (articulo.DESCUENTO) { // descuento individual del item
    articulo.PRECIO_UNITARIO *= (100 - articulo.DESCUENTO) / 100;
  }
  articulo.PRECIO_TOTAL = articulo.PRECIO_UNITARIO * articulo.CANTIDAD;
  window.grid.invalidateRow(window.dataView.getIdxById(articulo.id));
  window.grid.render();
}

function updateAllPrices (descuento, condicion = 'EFECTIVO') {
  const tipoPrecio = condicion === 'EFECTIVO' ? 'PRECIO_CONTADO' : 'PRECIO_LISTA';
  window.dataSet.forEach(articulo => {
    articulo.PRECIO_UNITARIO = articulo[tipoPrecio] * (100 - descuento) / 100;
    if (articulo.DESCUENTO) { // descuento individual del item
      articulo.PRECIO_UNITARIO = articulo.PRECIO_UNITARIO * articulo.DESCUENTO;
    }
    articulo.PRECIO_TOTAL = articulo.PRECIO_UNITARIO * articulo.CANTIDAD;
  });
  window.grid.invalidateAllRows();
  window.grid.render();
}
