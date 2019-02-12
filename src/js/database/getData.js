import axios from 'axios';

async function getAllArticulos () {
  const res = await axios(`http://192.168.0.2:3000/api/rawTables/full_articulos`);
  res.data[422].PROMO_BOOL = true; // FIXME: REMOVE, FOR TESTING PURPOSES.
  res.data[12].PROMO_BOOL = true; // FIXME: REMOVE, FOR TESTING PURPOSES.
  res.data[234].PROMO_BOOL = true; // FIXME: REMOVE, FOR TESTING PURPOSES.
  return res.data;
}

async function getArticuloByCodigo (codigo) {
  const res = await axios(`http://192.168.0.2:3000/api/articulo/${codigo}`);
  return res.data[0];
}

async function getClienteById (id) {
  const res = await axios(`http://192.168.0.2:3000/api/cliente/${id}`);
  return res.data[0];
}

async function getVendedorById (id) {
  const res = await axios(`http://192.168.0.2:3000/api/vendedor/${id}`);
  return res.data[0];
}

async function getNewNumeroFactura () {
  let lastNumeroFactura = await axios(`http://192.168.0.2:3000/api/factura/last`);
  return lastNumeroFactura.data + 1;
}

export {
  getAllArticulos,
  getArticuloByCodigo,
  getClienteById,
  getVendedorById,
  getNewNumeroFactura
};
