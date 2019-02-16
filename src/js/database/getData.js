import axios from 'axios';

// const URL = 'http://181.167.238.144:3000';
const URL = 'http://127.0.0.1:3000';

async function getAllArticulos () {
  const res = await axios(`${URL}/api/rawTables/full_articulos`);
  res.data[422].PROMO_BOOL = true; // FIXME: REMOVE, FOR TESTING PURPOSES.
  res.data[12].PROMO_BOOL = true; // FIXME: REMOVE, FOR TESTING PURPOSES.
  res.data[234].PROMO_BOOL = true; // FIXME: REMOVE, FOR TESTING PURPOSES.
  return res.data;
}

async function getArticuloByCodigo (codigo) {
  const res = await axios(`${URL}/api/articulo/${codigo}`);
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
  getAllArticulos,
  getTurnoActual,
  getArticuloByCodigo,
  getClienteById,
  getVendedorById,
  getNewNumeroFactura
};
