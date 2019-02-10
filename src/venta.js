// VARIABLE DEFINITIONS FOR SLICKGRID TABLE
let dataView;
let grid;
let data = [];
let state = {
  condicionPago: ['TARJETA', 'EFECTIVO', 'DEBITO', 'CREDITO_PROPIO'],
  tipoPago: 'TARJETA',
  factura: {}
};

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

setTimeout(e => addVentaItem('ZH2932030828'), 100);
setTimeout(e => addVentaItem('5985561826014'), 200);
setTimeout(e => addVentaItem('4883803077006'), 300);
setTimeout(e => addVentaItem('4883803077006'), 1000);

preVentaStuff();

// TODO: separate fetching data from intializing the grid
async function getArticuloByCodigo (codigo) {
  const res = await axios(`http://192.168.0.2:3000/api/articulo/${codigo}`);
  return res.data[0];
}

async function getClienteById (id) {
  const res = await axios(`http://192.168.0.2:3000/api/cliente/${id}`);
  return res.data[0];
}

async function getVendedorById (id) {
  const res = await axios(`http://192.168.0.2:3000/api/vendedor/${id}`);
  return res.data[0];
}

async function addVentaItem (codigo) {
  let idx = data.findIndex(e => e.CODIGO === codigo);
  let articulo;

  if (idx !== -1) {
    articulo = data[idx]; // it exists, add one.
    articulo.CANTIDAD += 1;
    updateArticuloPrice(articulo);
  } else {
    articulo = await getArticuloByCodigo(codigo);
    articulo.CANTIDAD = 1;
    articulo.DESCUENTO = 0; // TODO: HOOK UP GLOBAL DISCOUNT //STORE AS INT, DISLPAY AS INT AND PERCENTAJE, TAKE INPUT AS INT AND PERCENTAJE
    articulo.PRECIO_UNITARIO = articulo.PRECIO_LISTA; // TODO: HOOK UP LISTA/CONTADO/ETC
    data.push(articulo);
    updateArticuloPrice(articulo);
    dataView.beginUpdate();
    dataView.setItems(data);
    dataView.endUpdate();
  }
}

// TODO: VALIDATIONS. MAKE BETTER WAY TO ADJUST PRICE
function updateArticuloPrice (articulo) {
  if (articulo.DESCUENTO) {
    articulo.PRECIO_UNITARIO = articulo.PRECIO_UNITARIO * articulo.DESCUENTO;
  }
  articulo.PRECIO_TOTAL = articulo.PRECIO_UNITARIO * articulo.CANTIDAD;
  grid.invalidateRow(dataView.getIdxById(articulo.id));
  grid.render();
}

async function preVentaStuff () {
  let lastNumeroFactura = await axios(`http://192.168.0.2:3000/api/factura/last`);
  state.factura.numeroFactura = lastNumeroFactura.data + 1;
  document.querySelector('#venta-factura').value = state.factura.numeroFactura;

  let cliente = await getClienteById(1);
  state.factura.cliente = cliente;
  document.querySelector('#venta-cliente').value = state.factura.cliente.NOMBRE;

  let dropdownCondicionesDePago = document.querySelector('#venta-condicion-de-pago');

  state.condicionPago.forEach(condicion => {
    var option = document.createElement('option');
    option.value = condicion;
    option.innerHTML = condicion;
    dropdownCondicionesDePago.appendChild(option);
  });

  let vendedor = await getVendedorById(1);
  state.factura.vendedor = vendedor;
  document.querySelector('#venta-vendedor').value = state.factura.vendedor.NOMBRE;

  const time = new Date();
  state.factura.fecha = time;
  // FIXME: use library...
  const dateString = `${time.getDate()}/${time.getUTCMonth() + 1}/${time.getFullYear()}`;
  document.querySelector('#venta-fecha').value = dateString;

  // TODO: get turno
}

function selectCondicionPago () {
  // TODO: HANDLE CONDICIONES DE PAGO SELECTION
}

function selectClient () {
  // TODO: handle client selection
}

function addPago () {
  // TODO: add pagos
  // TODO: VALIDATIONS
}

function descuentoGlobal () {
  // TODO: set descuento global
  // TODO: VALIDATIONS
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
