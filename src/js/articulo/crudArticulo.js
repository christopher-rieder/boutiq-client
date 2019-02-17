import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';

const selectorsDOM = {
  id: document.querySelector('#crud-articulo__id'),
  CODIGO: document.querySelector('#crud-articulo__CODIGO'),
  DESCRIPCION: document.querySelector('#crud-articulo__DESCRIPCION'),
  PRECIO_LISTA: document.querySelector('#crud-articulo__PRECIO_LISTA'),
  PRECIO_CONTADO: document.querySelector('#crud-articulo__PRECIO_CONTADO'),
  PRECIO_COSTO: document.querySelector('#crud-articulo__PRECIO_COSTO'),
  STOCK: document.querySelector('#crud-articulo__STOCK'),
  RUBRO_ID: document.querySelector('#crud-articulo__RUBRO_ID'),
  MARCA_ID: document.querySelector('#crud-articulo__MARCA_ID'),
  PROMO_BOOL: document.querySelector('#crud-articulo__PROMO_BOOL'),
  DESCUENTO_PROMO: document.querySelector('#crud-articulo__DESCUENTO_PROMO')
};

window.addEventListener('load', async event => {
  loadTables();
  // TODO: GET DATA TO START EDITING AN ARTICULO WITH THE ID OR CODIGO PASSED THROUGH PARAMETER
  // const url = new URL(document.URL);
  // const searchParams = new URLSearchParams(url.search);
  // const cod = searchParams.get('codigo');
  // let articulo = await databaseRead.getArticuloByCodigo(cod);
  // if (articulo) {
  //   loadData(articulo);
  // }
});

document.querySelector('#search-codigo').addEventListener('search', async event => {
  let articulo = await databaseRead.getArticuloByCodigo(event.target.value);
  if (articulo) {
    loadData(articulo);
  }
  event.target.value = '';
});

async function loadData (articulo) {
  // get support tables
  const supportTables = await loadTables();

  // SET INPUTS WITH THE DATA LOADED FROM THE DATABASE
  Object.keys(articulo).forEach(prop => {
    if (selectorsDOM[prop].nodeName === 'INPUT' && selectorsDOM[prop].type !== 'checkbox') {
      selectorsDOM[prop].value = articulo[prop];
    }
    if (selectorsDOM[prop].nodeName === 'INPUT' && selectorsDOM[prop].type === 'checkbox') {
      selectorsDOM[prop].checked = !!(articulo[prop]);
    }
    if (selectorsDOM[prop].nodeName === 'SELECT') {
      const idx = supportTables[prop].findIndex(el => el.id === articulo[prop]);
      selectorsDOM[prop].selectedIndex = idx;
    }
  });

  setListeners(articulo, supportTables);
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

function setListeners (articulo, supportTables) {
  // MAIN LISTENER
  // IT DEPENDS OF CORRECTLY NAMING THE IDS OF HTML ELEMENTS
  function mainListener (event) {
    const property = event.target.id.replace('crud-articulo__', '');
    if (event.target.type === 'checkbox') {
      articulo[property] = !!(event.target.checked);
      return true;
    }
    if (event.target.nodeName === 'SELECT') {
      const id = event.target.selectedOptions[0].value;
      articulo[property] = supportTables[property].filter(marca => marca.id === parseInt(id))[0].id;
      return true;
    }
    if (event.target.nodeName === 'INPUT') {
      articulo[property] = event.target.value;
    }
  }
  window.removeEventListener('input', mainListener);
  window.addEventListener('input', mainListener);

  document.querySelector('.btn-guardar').addEventListener('click', event => {
    console.log(articulo);
    databaseWrite.putObjectToAPI(articulo, 'articulo');
    window.location.reload(true);
  });
}
