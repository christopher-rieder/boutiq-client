import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';

const selectorsDOM = {};

async function loadData () {
  let articulo = await databaseRead.getArticuloById(68);

  // SET INPUTS WITH THE DATA LOADED FROM THE DATABASE
  // AND ADD LISTENERS TO REFLECT THE STATE OF THE VIEW IN THE DATA
  Object.keys(articulo).forEach(prop => {
    selectorsDOM[prop] = document.querySelector('#crud-articulo__' + prop);
    if (selectorsDOM[prop].tagName === 'INPUT' && selectorsDOM[prop].type !== 'checkbox') {
      selectorsDOM[prop].value = articulo[prop];
      selectorsDOM[prop].addEventListener('input', event => {
        articulo[prop] = event.target.value;
      });
    }
    if (selectorsDOM[prop].tagName === 'INPUT' && selectorsDOM[prop].type === 'checkbox') {
      selectorsDOM[prop].checked = !!(articulo[prop]);
      selectorsDOM[prop].addEventListener('change', event => {
        articulo[prop] = !!(event.target.checked);
      });
    }
  });

  const marcas = await loadMarcas(articulo);
  const rubros = await loadRubros(articulo);

  window.addEventListener('dblclick', event => {
    if (event.ctrlKey && event.shiftKey) {
      putArticulo();
    }
  });

  window.addEventListener('input', event => {
    console.log('Event Captured From window', event);
  });

  async function putArticulo () {
    databaseWrite.putObjectToAPI(articulo, 'articulo');
  }
}

async function loadMarcas (articulo) {
  let marcas = await databaseRead.getTable('marca');
  var indexMarca = 0;
  marcas.forEach((marca, i) => {
    var option = document.createElement('option');
    option.dataset.id = marca.id;
    option.value = marca.NOMBRE;
    option.innerHTML = marca.NOMBRE;
    if (marca.id === articulo.MARCA_ID) {
      indexMarca = i;
      articulo.MARCA_ID = marca.id;
    }
    selectorsDOM.MARCA_ID.appendChild(option);
  });

  selectorsDOM.MARCA_ID.selectedIndex = indexMarca;
  selectorsDOM.MARCA_ID.addEventListener('change', event => {
    const id = document.querySelector('#crud-articulo__MARCA_ID').selectedOptions[0].dataset.id;
    articulo.MARCA_ID = marcas.filter(marca => marca.id === parseInt(id))[0].id;
  });

  return marcas;
}

async function loadRubros (articulo) {
  let rubros = await databaseRead.getTable('rubro');
  var indexRubro = 0;

  rubros.forEach((rubro, i) => {
    var option = document.createElement('option');
    option.dataset.id = rubro.id;
    option.value = rubro.NOMBRE;
    option.innerHTML = rubro.NOMBRE;
    if (rubro.id === articulo.RUBRO_ID) {
      indexRubro = i;
      articulo.RUBRO_ID = rubro.id;
    }
    selectorsDOM.RUBRO_ID.appendChild(option);
  });

  selectorsDOM.RUBRO_ID.selectedIndex = indexRubro;
  selectorsDOM.RUBRO_ID.addEventListener('change', event => {
    const id = document.querySelector('#crud-articulo__RUBRO_ID').selectedOptions[0].dataset.id;
    articulo.RUBRO_ID = rubros.filter(rubro => rubro.id === parseInt(id))[0].id;
  });

  return rubros;
}

loadData();
