import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import Articulo from './articulo';

window.articulo = {};
window.marcas = {};
window.rubros = {};
const selectorsDOM = {};

async function loadData () {
  let articuloData = await databaseRead.getArticuloById(68);
  window.articulo = new Articulo(articuloData, window.rubros, window.marcas);

  Object.keys(window.articulo).forEach(prop => {
    selectorsDOM[prop] = document.querySelector('#crud-articulo__' + prop);
    if (selectorsDOM[prop].tagName === 'INPUT' && selectorsDOM[prop].type !== 'checkbox') {
      selectorsDOM[prop].value = window.articulo[prop];
      selectorsDOM[prop].addEventListener('input', event => {
        window.articulo[prop] = event.target.value;
      });
    }
  });

  selectorsDOM.promo.checked = !!(window.articulo.promo);
  selectorsDOM.promo.addEventListener('change', event => {
    window.articulo.promo = !!(event.target.checked);
  });

  const marcas = await loadMarcas();
  const rubros = await loadRubros();
}

async function loadMarcas () {
  let marcas = await databaseRead.getTable('marca');
  var indexMarca = 0;
  marcas.forEach((marca, i) => {
    var option = document.createElement('option');
    option.dataset.id = marca.id;
    option.value = marca.NOMBRE;
    option.innerHTML = marca.NOMBRE;
    if (marca.id === window.articulo.marca) {
      indexMarca = i;
      window.articulo.marca = marca;
    }
    selectorsDOM.marca.appendChild(option);
  });

  selectorsDOM.marca.selectedIndex = indexMarca;
  selectorsDOM.marca.addEventListener('change', event => {
    const id = document.querySelector('#crud-articulo__marca').selectedOptions[0].dataset.id;
    window.articulo.marca = marcas.filter(marca => marca.id === parseInt(id))[0];
  });

  return marcas;
}

async function loadRubros () {
  let rubros = await databaseRead.getTable('rubro');
  var indexRubro = 0;

  rubros.forEach((rubro, i) => {
    var option = document.createElement('option');
    option.dataset.id = rubro.id;
    option.value = rubro.NOMBRE;
    option.innerHTML = rubro.NOMBRE;
    if (rubro.id === window.articulo.rubro) {
      indexRubro = i;
      window.articulo.rubro = rubro;
    }
    selectorsDOM.rubro.appendChild(option);
  });

  selectorsDOM.rubro.selectedIndex = indexRubro;
  selectorsDOM.rubro.addEventListener('change', event => {
    const id = document.querySelector('#crud-articulo__rubro').selectedOptions[0].dataset.id;
    window.articulo.rubro = rubros.filter(rubro => rubro.id === parseInt(id))[0];
  });

  return rubros;
}

loadData();

window.addEventListener('dblclick', event => {
  if (event.ctrlKey && event.shiftKey) {
    putArticulo();
  }
});

async function putArticulo () {
  const articuloData = {};

  articuloData.id = window.articulo.id;
  articuloData.CODIGO = window.articulo.codigo;
  articuloData.DESCRIPCION = window.articulo.descripcion;
  articuloData.PRECIO_LISTA = window.articulo.precioLista;
  articuloData.PRECIO_CONTADO = window.articulo.precioContado;
  articuloData.PRECIO_COSTO = window.articulo.precioCosto;
  articuloData.STOCK = window.articulo.stock;
  articuloData.RUBRO_ID = window.articulo.rubro.id;
  articuloData.MARCA_ID = window.articulo.marca.id;
  articuloData.PROMO_BOOL = window.articulo.promo ? 1 : 0;
  articuloData.DESCUENTO_PROMO = window.articulo.descuento;

  databaseWrite.putObjectToAPI(articuloData, 'articulo');
  console.log(articuloData);
}
