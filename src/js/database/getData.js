// const URL = 'http://181.167.238.144:3000';
const URL = 'http://192.168.0.2:3000';

function getBussinessConstants () {
  return window.fetch(`${URL}/api/rawTables/constants`).then(res => res.json());
}

function getTable (table) {
  return window.fetch(`${URL}/api/rawTables/${table}`).then(res => res.json());
}

function getAllArticulos () {
  return window.fetch(`${URL}/api/rawTables/full_articulos`).then(res => res.json());
}

function getAllFacturas () {
  return window.fetch(`${URL}/api/factura/all`).then(res => res.json());
}

function getAllCompras () {
  return window.fetch(`${URL}/api/compra/all`).then(res => res.json());
}

function getArticuloByCodigo (codigo) {
  return window.fetch(`${URL}/api/articulo/codigo/${codigo}`).then(res => res.json());
}

function getArticuloById (id) {
  return window.fetch(`${URL}/api/articulo/id/${id}`).then(res => res.json());
}

function getItemById (tabla, id) {
  return window.fetch(`${URL}/api/${tabla}/${id}`).then(res => res.json());
}

function getLastNumeroFactura () {
  return window.fetch(`${URL}/api/factura/last`).then(res => res.json());
}

function getLastNumeroCompra () {
  return window.fetch(`${URL}/api/compra/last`).then(res => res.json());
}

function getTurnoActual () {
  return window.fetch(`${URL}/api/turno/actual`).then(res => res.json());
}

export {
  getBussinessConstants,
  getTable,
  getAllArticulos,
  getAllFacturas,
  getAllCompras,
  getTurnoActual,
  getArticuloByCodigo,
  getArticuloById,
  getItemById,
  getLastNumeroCompra,
  getLastNumeroFactura
};
