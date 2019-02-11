import * as database from '../database/getData';
import {Input, InputText} from '../components/inputs';
import './jquery-global.js';
import './jquery-ui-1.11.3.min.js';
import './jquery.event.drag-2.3.0';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
require('slickgrid/slick.core.js');
require('slickgrid/slick.grid.js');
require('slickgrid/slick.formatters.js');
require('slickgrid/slick.editors.js');
require('slickgrid/plugins/slick.rowselectionmodel.js');
require('slickgrid/slick.dataview.js');
let audioError = require('./error.wav');
let audioOk = require('./ok.wav');

const condicionPago = ['TARJETA', 'EFECTIVO', 'DEBITO', 'CREDITO_PROPIO'];
class Venta extends Component {
  constructor (props) {
    super(props);
    this.state = {
      currentNroFactura: 0,
      cliente: {},
      vendedor: {},
      fecha: new Date(),
      turno: {},
      observaciones: '',
      codigo: '',
      condicionPago: 'TARJETA',
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
    this.setState(prevState => { // FIXME: IN 80 UPDATE PRICES CORRECTLY
      if (/^[1-9]+\.?\d*$/.test(descuento) || descuento === '') { // valid positive float
        console.log('PONCHO');
        if (descuento === '') {
          descuento = 0;
        }
        descuento = parseFloat(descuento) || '';
        descuento = descuento > 80 ? 80 : descuento;
        updateAllPrices(descuento, this.state.condicionPago);
        return {descuento};
      } else {
        this.descuentoInput.current.classList.add('error-shake');
        setTimeout(e => this.descuentoInput.current.classList.remove('error-shake'), 500);
        updateAllPrices(0, this.state.condicionPago);
        return {prevState};
      }
    });
  }

  handleCondicionPago (event) {
    this.setState({condicionPago: event.target.value});
    updateAllPrices(this.state.descuento, this.state.condicionPago);
  }

  async onSubmit (event) {
    event.preventDefault();
    // TODO: POST DATA TO API AFTER CONFIRMATION AND VALIDATION
  }

  // preload info
  async componentWillMount () {
    const currentNroFactura = await database.getNewNumeroFactura();
    this.setState({currentNroFactura});
    const cliente = await database.getClienteById(1);
    this.setState({cliente});
    const vendedor = await database.getVendedorById(1);
    this.setState({vendedor});

    let dropdownCondicionesDePago = document.querySelector('#venta-condicion-de-pago');

    condicionPago.forEach(condicion => {
      var option = document.createElement('option');
      option.value = condicion;
      option.innerHTML = condicion;
      dropdownCondicionesDePago.appendChild(option);
    });

  // TODO: get turno
  }

  componentDidMount () {
    this.codigoInput.current.focus();
    setTimeout(e => addVentaItem('ZH2932030828'), 100);
    setTimeout(e => addVentaItem('5985561826014'), 200);
    setTimeout(e => addVentaItem('4883803077006'), 300);
    setTimeout(e => addVentaItem('4883803077006'), 1000);
  }

  getDate () {
  // FIXME: use library...
    const time = this.state.fecha;
    return `${time.getDate()}/${time.getUTCMonth() + 1}/${time.getFullYear()}`;
  }

  async addItem (event) { // ZH2932030828
    let boolAdded = await addVentaItem(this.state.codigo);
    this.setState({codigo: ''});
    this.codigoInput.current.focus();
    if (boolAdded) {
      // TODO: USER POSITIVE FEEDBACK. TOAST?
      var aud = new Audio(audioOk);
      aud.play();
    } else {
      this.codigoInput.current.classList.add('error-shake');
      setTimeout(e => this.codigoInput.current.classList.remove('error-shake'), 500);
      var aud2 = new Audio(audioError);
      aud2.play();
    }
  }

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
              <select value={this.state.condicionPago} name='venta-condicion-de-pago' id='venta-condicion-de-pago' onChange={this.handleCondicionPago} />
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

ReactDOM.render(<Venta />, document.getElementById('app'));

// GRID STUFF
// VARIABLE DEFINITIONS FOR SLICKGRID TABLE
let dataView;
let grid;
let data = [];

let options = {
  enableCellNavigation: true,
  multiSelect: false,
  topPanelHeight: 30,
  rowHeight: 30,
  editable: true,
  autoEdit: true,
  explicitInitialization: true
};

// TODO: read column preferences from a configuration file, persist this preferences
// COLUMNS DEFINITIONS
let columns = [
  {
    id: 'CANTIDAD',
    name: 'cantidad',
    field: 'CANTIDAD',
    minWidth: 60,
    editor: Slick.Editors.Text,
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
    editor: Slick.Editors.Text,
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
    editor: Slick.Editors.Text,
    cssClass: 'cell-title'
  }
];

dataView = new Slick.Data.DataView();
grid = new Slick.Grid('#myGrid', dataView, columns, options);
grid.setSelectionModel(new Slick.RowSelectionModel());

// wire up model events to drive the grid
// !! both dataView.onRowCountChanged and dataView.onRowsChanged MUST be wired to correctly update the grid
// see Issue#91
dataView.onRowCountChanged.subscribe(function (e, args) {
  grid.updateRowCount();
  grid.render();
});

dataView.onRowsChanged.subscribe(function (e, args) {
  grid.invalidateRows(args.rows);
  grid.render();
});

grid.onCellChange.subscribe(function (event, activeCell) {
  updateArticuloPrice(activeCell.item);
});

grid.init();
// initialize the model after all the events have been hooked up
$('#gridContainer').resizable();

// TODO: separate fetching data from intializing the grid

async function addVentaItem (codigo) {
  let articulo = data.find(e => e.CODIGO === codigo);

  if (articulo) {
    articulo.CANTIDAD += 1;
  } else {
    articulo = await database.getArticuloByCodigo(codigo);
    if (!articulo) return false;
    articulo.CANTIDAD = 1;
    data.push(articulo);
    dataView.beginUpdate();
    dataView.setItems(data);
    dataView.endUpdate();
  }

  updateArticulo(articulo);
  return true;
}

async function selectClient (nro) {
  let cliente = await database.getClienteById(nro);
  state.factura.cliente = cliente;
  document.querySelector('#venta-cliente').value = state.factura.cliente.NOMBRE;
}

function addPago () {
  // TODO: add pagos
  // TODO: VALIDATIONS
}

function updateArticulo (articulo, descuento = 0, condicion = 'TARJETA') {
  const tipoPrecio = condicion === 'EFECTIVO' ? 'PRECIO_CONTADO' : 'PRECIO_LISTA';

  articulo.PRECIO_UNITARIO = articulo[tipoPrecio] * (100 - descuento) / 100;
  if (articulo.DESCUENTO) { // descuento individual del item
    articulo.PRECIO_UNITARIO *= (100 - articulo.DESCUENTO) / 100;
  }
  articulo.PRECIO_TOTAL = articulo.PRECIO_UNITARIO * articulo.CANTIDAD;
  grid.invalidateRow(dataView.getIdxById(articulo.id));
  grid.render();
}

function updateAllPrices (descuento, condicion) {
  const tipoPrecio = condicion === 'EFECTIVO' ? 'PRECIO_CONTADO' : 'PRECIO_LISTA';
  data.forEach(articulo => {
    articulo.PRECIO_UNITARIO = articulo[tipoPrecio] * (100 - descuento) / 100;
    if (articulo.DESCUENTO) { // descuento individual del item
      articulo.PRECIO_UNITARIO = articulo.PRECIO_UNITARIO * articulo.DESCUENTO;
    }
    articulo.PRECIO_TOTAL = articulo.PRECIO_UNITARIO * articulo.CANTIDAD;
  });
  grid.invalidateAllRows();
  grid.render();
}

function processSeña () {
  // TODO: process seña stuff
}

function articuloSearchFunctionality () {
  // TODO: handle the selection and search of articulos
}

function postVentaStuff () {
  // TODO: VALIDATIONS
  // TODO: make confirmation stage
  // TODO: make post to api
  // TODO: inform user

}
