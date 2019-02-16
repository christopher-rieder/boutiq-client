// const URL = 'http://181.167.238.144:3000';
const URL = 'http://127.0.0.1:3000';

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

async function postObjectToAPI (item, endpoint) {
  return window.fetch(`${URL}/api/` + endpoint, {
    method: 'post',
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
  postObjectToAPI,
  postItemFactura
};
