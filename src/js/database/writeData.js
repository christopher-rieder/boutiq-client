function postFactura (factura) {
  return window.fetch('http://192.168.0.2:3000/api/factura', {
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
  return window.fetch('http://192.168.0.2:3000/api/itemFactura', {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(res => res.json());
}

async function postObjectToAPI (item, endpoint) {
  return window.fetch('http://192.168.0.2:3000/api/' + endpoint, {
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
