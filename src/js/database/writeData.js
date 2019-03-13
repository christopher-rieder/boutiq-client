// const URL = 'http://181.167.238.144:3000';
const URL = 'http://192.168.0.2:3000';

const processError = res => Promise.all([res, res.json()]);
const returnJsonOrError = ([res, json]) => {
  if (!res.ok) throw new Error(json.message);
  return json;
};

async function updatePago (item) {
  return window.fetch(`${URL}/api/pago/${item.id}`, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(processError)
    .then(returnJsonOrError);
}

async function postCrudObjectToAPI (item, table) {
  return window.fetch(`${URL}/api/crud/` + table, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(processError)
    .then(returnJsonOrError);
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
  updatePago,
  postCrudObjectToAPI,
  postObjectToAPI
};
