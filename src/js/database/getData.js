const URL = 'http://181.167.238.144:3000';
// const URL = 'http://192.168.0.2:3000';

function getTable (table) {
  return window.fetch(`${URL}/api/rawTables/${table}`).then(res => res.json());
}

function getAllArticulos () {
  return window.fetch(`${URL}/api/rawTables/full_articulos`).then(res => res.json());
}

function getAllCompras () {
  return window.fetch(`${URL}/api/compra/all`).then(res => res.json());
}

function getAllSeñas () {
  return window.fetch(`${URL}/api/seña/all`).then(res => res.json());
}

function getAllRetiros () {
  return window.fetch(`${URL}/api/retiro/all`).then(res => res.json());
}

function getPagosPendientes () {
  return window.fetch(`${URL}/api/pago/pendientes`).then(res => res.json());
}

function getArticuloByCodigo (codigo) {
  return window.fetch(`${URL}/api/articulo/codigo/${codigo}`).then(res => res.json()).then(res => res[0]);
}

function getFacturasById (id) {
  return window.fetch(`${URL}/api/factura/${id}`).then(res => res.json()).then(res => res[0]);
}

function getArticuloById (id) {
  return window.fetch(`${URL}/api/articulo/id/${id}`).then(res => res.json()).then(res => res[0]);
}

function getItemById (tabla, id) {
  return window.fetch(`${URL}/api/${tabla}/${id}`).then(res => res.json()).then(res => res[0]);
}

function getLastNumeroFactura () {
  return window.fetch(`${URL}/api/factura/last`).then(res => res.json()).then(res => res[0]);
}

function getLastNumeroCompra () {
  return window.fetch(`${URL}/api/compra/last`).then(res => res.json()).then(res => res[0]);
}

function getLastNumeroSeña () {
  return window.fetch(`${URL}/api/seña/last`).then(res => res.json()).then(res => res[0]);
}

function getLastNumeroRetiro () {
  return window.fetch(`${URL}/api/retiro/last`).then(res => res.json()).then(res => res[0]);
}

function getLastTurno () {
  return window.fetch(`${URL}/api/turno/last`).then(res => res.json()).then(res => res[0]);
}

function getCajaActual () {
  return window.fetch(`${URL}/api/caja/actual`).then(res => res.json()).then(res => res[0]);
}

function getResumenCaja (id) {
  return window.fetch(`${URL}/api/caja/resumen/${id}`).then(res => res.json());
}

function getResumenTurno (id) {
  return window.fetch(`${URL}/api/turno/resumen/${id}`).then(res => res.json());
}

export {
  getResumenCaja,
  getResumenTurno,
  getTable,
  getAllArticulos,
  getAllCompras,
  getAllSeñas,
  getAllRetiros,
  getPagosPendientes,
  getLastTurno,
  getCajaActual,
  getArticuloByCodigo,
  getArticuloById,
  getFacturasById,
  getItemById,
  getLastNumeroRetiro,
  getLastNumeroSeña,
  getLastNumeroCompra,
  getLastNumeroFactura
};
