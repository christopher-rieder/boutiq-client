import axios from 'axios';

// const URL = 'http://181.167.238.144:3000';
const URL = 'http://127.0.0.1:3000';

async function getTable (table) {
  const res = await axios(`${URL}/api/rawTables/${table}`);
  return res.data;
}

async function getAllArticulos () {
  const res = await axios(`${URL}/api/rawTables/full_articulos`);
  return res.data;
}

async function getArticuloByCodigo (codigo) {
  const res = await axios(`${URL}/api/articulo/codigo/${codigo}`);
  return res.data[0];
}

async function getArticuloById (id) {
  const res = await axios(`${URL}/api/articulo/id/${id}`);
  return res.data[0];
}

async function getClienteById (id) {
  const res = await axios(`${URL}/api/cliente/${id}`);
  return res.data[0];
}

async function getVendedorById (id) {
  const res = await axios(`${URL}/api/vendedor/${id}`);
  return res.data[0];
}

async function getNewNumeroFactura () {
  let lastNumeroFactura = await axios(`${URL}/api/factura/last`);
  return lastNumeroFactura.data + 1;
}

async function getTurnoActual () {
  let turnoActual = await axios(`${URL}/api/turno/actual`);
  return turnoActual.data[0];
}

export {
  getTable,
  getAllArticulos,
  getTurnoActual,
  getArticuloByCodigo,
  getArticuloById,
  getClienteById,
  getVendedorById,
  getNewNumeroFactura
};
