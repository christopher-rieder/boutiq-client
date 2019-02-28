// const URL = 'http://181.167.238.144:3000';
const URL = 'http://192.168.0.2:3000';

function getTable (table) {
  return fetch(`${URL}/api/rawTables/${table}`).then(res => res.json());
}

function getAllArticulos () {
  return fetch(`${URL}/api/rawTables/full_articulos`).then(res => res.json());
}

function getAllFacturas () {
  return fetch(`${URL}/api/factura/all`).then(res => res.json());
}

function getArticuloByCodigo (codigo) {
  return fetch(`${URL}/api/articulo/codigo/${codigo}`).then(res => res.json());
}

function getArticuloById (id) {
  return fetch(`${URL}/api/articulo/id/${id}`).then(res => res.json());
}

function getClienteById (id) {
  return fetch(`${URL}/api/cliente/${id}`).then(res => res.json());
}

function getVendedorById (id) {
  return fetch(`${URL}/api/vendedor/${id}`).then(res => res.json());
}

function getLastNumeroFactura () {
  return fetch(`${URL}/api/factura/last`).then(res => res.json());
}

function getTurnoActual () {
  return fetch(`${URL}/api/turno/actual`).then(res => res.json());
}

export {
  getTable,
  getAllArticulos,
  getAllFacturas,
  getTurnoActual,
  getArticuloByCodigo,
  getArticuloById,
  getClienteById,
  getVendedorById,
  getLastNumeroFactura
};
