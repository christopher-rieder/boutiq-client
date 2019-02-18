import * as databaseRead from '../database/getData';
import {articuloColumns, articuloColumsnConfig} from '../database/tableColumns';

let markup = articuloColumns.reduce((str, col) => {
  str += `<label for="crud-articulo__${col}">${col}</label>`;
  switch (articuloColumsnConfig[col].type) {
    case 'id':
      str += `<input readonly required name=${col} type="text" id="crud-articulo__id" value="NUEVO ARTICULO">`;
      break;
    case 'text':
      str += `<input required name=${col} type="text" id="crud-articulo__${col}" placeholder="${col}" autocomplete="off">`;
      break;
    case 'integer':
      str += `<input required name=${col} type="number" id="crud-articulo__${col}" placeholder="${col}">`;
      break;
    case 'float':
      str += `<input required name=${col} type="number" id="crud-articulo__${col}" placeholder="${col}">`;
      break;
    case 'boolean':
      str += `<input name=${col} type="checkbox" id="crud-articulo__${col}">`;
      break;
    case 'select':
      str += `<select required name=${col} id="crud-articulo__${col}"></select>`;
      break;
    default:
      break;
  }
  str += `<div id=${col}OK></div>`;
  return str;
}, '');

document.querySelector('#crud-articulo').insertAdjacentHTML('afterbegin', markup);

document.querySelector('#crud-articulo').insertAdjacentHTML('afterend', `
<div>
  <input type="submit" value="Guardar" class="btn-guardar">
</div>`);

const selectorsDOM = {};
articuloColumns.forEach(col => {
  selectorsDOM[col] = document.querySelector('#crud-articulo__' + col);
});

// SET 'POST' URL

window.addEventListener('load', async event => {
  document.querySelector('#crud-articulo-form').action = 'http://127.0.0.1:3000/api/articulo';
  // get support tables
  window.supportTables = await loadTables();

  // TODO: GET DATA TO START EDITING AN ARTICULO WITH THE ID OR CODIGO PASSED THROUGH PARAMETER
  const url = new URL(document.URL);
  const searchParams = new URLSearchParams(url.search);
  const cod = searchParams.get('codigo');
  let articulo = await databaseRead.getArticuloByCodigo(cod);
  if (articulo) {
    loadData(articulo);
  }
});

document.querySelector('#search-codigo').addEventListener('search', async event => {
  if (event.target.value) {
    let articulo = await databaseRead.getArticuloByCodigo(event.target.value);
    loadData(articulo);
  }
  event.target.value = '';
});

function loadData (articulo) {
  Object.keys(articulo).forEach(prop => {
    if (selectorsDOM[prop].nodeName === 'INPUT' && selectorsDOM[prop].type !== 'checkbox') {
      selectorsDOM[prop].value = articulo[prop];
    }
    if (selectorsDOM[prop].nodeName === 'INPUT' && selectorsDOM[prop].type === 'checkbox') {
      selectorsDOM[prop].checked = !!(articulo[prop]);
    }
    if (selectorsDOM[prop].nodeName === 'SELECT') {
      const idx = window.supportTables[prop].findIndex(el => el.id === articulo[prop]);
      selectorsDOM[prop].selectedIndex = idx;
    }
  });
}

async function loadTables () {
  const tables = {
    MARCA_ID: await databaseRead.getTable('marca'),
    RUBRO_ID: await databaseRead.getTable('rubro')
  };

  Object.keys(tables).forEach(key => {
    tables[key].forEach(element => {
      let option = document.createElement('option');
      option.value = element.id;
      option.innerHTML = element.NOMBRE;
      selectorsDOM[key].appendChild(option);
    });
  });

  return tables;
}
