import axios from 'axios';

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
  return lastNumeroFactura + 1;
}

export {
  getArticuloByCodigo,
  getClienteById,
  getVendedorById,
  getNewNumeroFactura
};
