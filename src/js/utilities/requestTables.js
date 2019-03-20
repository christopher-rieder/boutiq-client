import { getTable } from '../database/getData';
const tablesToRequest = ['CONSTANTS', 'MARCA', 'RUBRO', 'ESTADO_PAGO', 'TIPO_PAGO', 'ARTICULO'];

// this tables are always loaded
const requestTables = () => (dispatch) => {
  tablesToRequest.forEach(table => {
    dispatch({type: `REQUEST_${table}_TABLE_PENDING`});
    getTable(table)
      .then(res => dispatch({type: `REQUEST_${table}_TABLE_SUCCESS`, payload: res}))
      .catch(error => dispatch({type: `REQUEST_${table}_TABLE_FAILED`, payload: error}));
  });
};

const requestTable = (table) => (dispatch) => {
  if (!tablesToRequest.includes(table)) return;

  dispatch({type: `REQUEST_${table}_TABLE_PENDING`});
  getTable(table)
    .then(res => dispatch({type: `REQUEST_${table}_TABLE_SUCCESS`, payload: res}))
    .catch(error => dispatch({type: `REQUEST_${table}_TABLE_FAILED`, payload: error}));
};

export {
  requestTable,
  requestTables
};
