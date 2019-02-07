// VARIABLE DEFINITIONS FOR SLICKGRID TABLE
let dataView;
let grid;
let data = [];

let options = {
  columnPicker: {
    columnTitle: 'Columns',
    hideForceFitButton: true,
    hideSyncResizeButton: true,
    forceFitTitle: 'Force fit columns',
    syncResizeTitle: 'Synchronous resize'
  },
  enableCellNavigation: true,
  showHeaderRow: true,
  headerRowHeight: 30,
  multiSelect: false,
  topPanelHeight: 25,
  explicitInitialization: true
};

// TODO: read column preferences from a configuration file, persist this preferences
// COLUMNS DEFINITIONS
let columns = [{
  id: 'CODIGO',
  name: 'codigo',
  field: 'CODIGO',
  width: 100,
  minWidth: 100,
  cssClass: 'cell-title',
  sortable: true
},
{
  id: 'DESCRIPCION',
  name: 'Descripcion',
  field: 'DESCRIPCION',
  width: 120,
  minWidth: 120,
  cssClass: 'cell-title',
  sortable: true
},
{
  id: 'PRECIO_LISTA',
  name: 'Precio Lista',
  field: 'PRECIO_LISTA',
  width: 70,
  minWidth: 70,
  cssClass: 'cell-title',
  sortable: true
},
{
  id: 'PRECIO_CONTADO',
  name: 'Precio Contado',
  field: 'PRECIO_CONTADO',
  width: 85,
  minWidth: 85,
  cssClass: 'cell-title',
  sortable: true
},
{
  id: 'PRECIO_COSTO',
  name: 'Precio Costo',
  field: 'PRECIO_COSTO',
  width: 75,
  minWidth: 75,
  cssClass: 'cell-title',
  sortable: true
},
{
  id: 'STOCK',
  name: 'Stock',
  field: 'STOCK',
  width: 40,
  minWidth: 40,
  cssClass: 'cell-title',
  sortable: true
},
{
  id: 'RUBRO',
  name: 'Rubro',
  field: 'RUBRO',
  width: 120,
  minWidth: 120,
  cssClass: 'cell-title',
  doubleClickFilter: true,
  sortable: true
},
{
  id: 'MARCA',
  name: 'Marca',
  field: 'MARCA',
  width: 120,
  minWidth: 120,
  cssClass: 'cell-title',
  doubleClickFilter: true,
  sortable: true
},
{
  id: 'PROMO_BOOL',
  name: 'Promo',
  width: 45,
  maxWidth: 45,
  cssClass: 'cell-effort-driven',
  field: 'PROMO_BOOL',
  formatter: Slick.Formatters.Checkmark,
  resizable: false
},
{
  id: 'PRECIO_PROMO',
  name: 'Precio Promo',
  field: 'PRECIO_PROMO',
  width: 75,
  minWidth: 75,
  cssClass: 'cell-title',
  sortable: true
}
];

dataView = new Slick.Data.DataView();
grid = new Slick.Grid('#myGrid', dataView, columns, options);
grid.setSelectionModel(new Slick.RowSelectionModel());

let pager = new Slick.Controls.Pager(dataView, grid, $('#pager'));
let columnpicker = new Slick.Controls.ColumnPicker(columns, grid, options);

// COMPARISON AND FILTERING
let sortcol = 'title';
let sortdir = 1;

function comparer (a, b) {
  let x = a[sortcol];
  let y = b[sortcol];
  return (x === y ? 0 : (x > y ? 1 : -1));
}

// these are the filters that are defined by the client in runtime with input elements
// they don't need to be defined here
let columnFilters = {};

// TODO: implement functions
// this filter function will be called according to each column definition
let filterFunctions = {

  anchoredTextFiltering: function (boolBeggining, boolEnd) {
    const anchorBeggining = boolBeggining ? '^' : '';
    const anchorEnd = boolEnd ? '$' : '';

    return function (text, filter) {
      let regex = new RegExp(anchorBeggining + filter + anchorEnd, 'i');
      return regex.test(text);
    };
  },

  wordFiltering: function (boolSplit) {
    // check split boolean for spliting words or not.
    return function (text, filter) {
      if (boolSplit) {
        return filter.split(' ')
          .map(word => new RegExp(word, 'i'))
          .every(regex => regex.test(text));
      } else {
        let regex = new RegExp(filter, 'i');
        return regex.test(text);
      }
    };
  },

  numberRangeFiltering: function () {}, // +300, -300, 300+, 300-, 300-400, 300 400
  booleanFiltering: function () {}, // true or false
  dateRangeFiltering: function () {} // use a library or package. moment.js?
};

let columnFilterFunctions = {
  CODIGO: filterFunctions.anchoredTextFiltering(true, false),
  DESCRIPCION: filterFunctions.wordFiltering(true),
  MARCA: filterFunctions.anchoredTextFiltering(true, true),
  RUBRO: filterFunctions.anchoredTextFiltering(true, true),
  PRECIO_LISTA: filterFunctions.numberRangeFiltering(),
  PRECIO_CONTADO: filterFunctions.numberRangeFiltering(),
  PRECIO_COSTO: filterFunctions.numberRangeFiltering(),
  PRECIO_PROMO: filterFunctions.numberRangeFiltering(),
  STOCK: filterFunctions.numberRangeFiltering(),
  PROMO_BOOL: filterFunctions.booleanFiltering()
};

// NOTE: Idea for optimization, if necesary.
//       Add a filtered propertie to each data row if is filtered.
//       Check here; if(!item.filtered), to process only unfiltered items.
//       A clear filter function is needed, and it needs to be fired when the
//       filtering is invalidated too. For example, using backspace to erase a letter
//       in the filter, or selecting letters and replacing them with another letter
//       Basically, when the new filter doesn't contain the previous filter inside
function filter (item) {
  for (let columnId in columnFilters) {
    if (columnId) {
      if (!columnFilterFunctions[columnId](item[columnId], columnFilters[columnId])) {
        return false;
      }
    }
  }
  return true;
}

// this function attachs the data to the input elements in the DOM
// here i can modify if a want a checkbox, like in this case
grid.onHeaderRowCellRendered.subscribe(function (e, args) {
  $(args.node).empty();
  if (args.column.id === 'PROMO_BOOL') {
    $("<input type='checkbox'>") // add checkbox for promo_bool
      .data('columnId', args.column.id)
      .val(columnFilters[args.column.id])
      .appendTo(args.node);
  } else {
    $("<input type='text'>") // for others, add text field
      .data('columnId', args.column.id)
      .val(columnFilters[args.column.id])
      .appendTo(args.node);
  }
});

// for certain columns (like rubro and marca) i allow filtering with a double click
// we need to update the columnFilter object, and reflect that filter in the view, in the input element
// get div containing selected cell, to obtain value from DOM
// can't get it from data array, because we don't have the index in the dataset
// we only have te index of the selected row in the current view, wich is probably different
grid.onDblClick.subscribe(function (e) {
  let cell = grid.getCellFromEvent(e); // row and column number of the active cell
  let {id, doubleClickFilter} = columns[cell.cell];
  if (doubleClickFilter) {
    let dataValue = grid.getActiveCellNode().textContent; // Reading from the DOM
    columnFilters[id] = dataValue;

    // get div containt input element child, then get child and assign the value
    // to reflect the new state of the view.
    grid.getHeaderRowColumn(id).firstChild.value = dataValue;
    dataView.refresh();
  }
});

$(grid.getHeaderRow()).on('change keyup', ':input', function (e) {
  let columnId = $(this).data('columnId');
  if (columnId != null) {
    if (columnId === 'PROMO_BOOL') {
      columnFilters[columnId] = this.checked ? this.checked : '';
    } else {
      columnFilters[columnId] = $.trim($(this).val());
    }
    dataView.refresh();
  }
});

let h_runfilters = null;

grid.onSort.subscribe(function (e, args) {
  sortdir = args.sortAsc ? 1 : -1;
  sortcol = args.sortCol.field;

  dataView.sort(comparer, args.sortAsc);
});

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

dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
  grid.updatePagingStatusFromView(pagingInfo);
});

getArticulos();

// TODO: separate fetching data from intializing the grid
async function getArticulos () {
  const res = await axios(`http://192.168.0.2:3000/api/rawTables/full_articulos`);
  // the data elements need an 'id' property for the slickgrid library
  // this can come directly from the table or view in the database
  data = res.data;
  data[422].PROMO_BOOL = true;
  data[12].PROMO_BOOL = true;
  data[234].PROMO_BOOL = true;

  grid.init();
  // initialize the model after all the events have been hooked up
  dataView.beginUpdate();
  dataView.setItems(data);
  dataView.setFilter(filter);
  dataView.endUpdate();

  $('#gridContainer').resizable();
}
