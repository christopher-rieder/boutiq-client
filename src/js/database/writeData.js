// const URL = 'http://181.167.238.144:3000';
const URL = 'http://192.168.0.2:3000';

const processError = res => Promise.all([res, res.json()]);
const returnJsonOrError = ([res, json]) => {
  if (!res.ok) throw new Error(json.message);
  return json;
};

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

function postCompra (factura) {
  return window.fetch(`${URL}/api/compra`, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(factura)
  }).then(res => res.json())
    .then(res => res.lastId);
}

async function postItemCompra (item) {
  return window.fetch(`${URL}/api/itemCompra`, {
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

async function updatePago (item) {
  return window.fetch(`${URL}/api/pago/${item.id}`, {
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

function postObjectToAPI (item, endpoint) {
  return window.fetch(`${URL}/api/` + endpoint, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(processError)
    .then(returnJsonOrError);
}

export {
  postCompra,
  postItemCompra,
  postFactura,
  postPago,
  updatePago,
  postCrudObjectToAPI,
  postObjectToAPI,
  postItemFactura
};
