// const URL = 'http://181.167.238.144:3000';
const URL = 'http://192.168.0.2:3000';

function postFactura (factura) {
  return window.fetch(`${URL}/api/factura`, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(factura)
  }).then(res => res.json())
    .then(res => res.lastId);
}

async function postItemFactura (item) {
  return window.fetch(`${URL}/api/itemFactura`, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(res => res.json());
}

async function postPago (item) {
  return window.fetch(`${URL}/api/pago`, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(res => res.json());
}

async function postCrudObjectToAPI (item, table) {
  return window.fetch(`${URL}/api/crud/` + table, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(res => res.json())
    .then(res => res.lastId);
}

async function putObjectToAPI (item, endpoint) {
  console.log(`${URL}/api/` + endpoint);
  return window.fetch(`${URL}/api/` + endpoint, {
    method: 'put',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(res => res.json())
    .then(res => res.lastId);
}

export {
  postFactura,
  postPago,
  postCrudObjectToAPI,
  putObjectToAPI,
  postItemFactura
};
