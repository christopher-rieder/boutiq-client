import { getTable } from '../database/getData';

const requestTables = () => (dispatch) => {
  const tablesToRequest = ['CONSTANTS', 'MARCA', 'RUBRO', 'ESTADO_PAGO', 'TIPO_PAGO', 'ARTICULO'];
  tablesToRequest.forEach(table => {
    dispatch({type: `REQUEST_${table}_TABLE_PENDING`});
    getTable(table)
      .then(res => dispatch({type: `REQUEST_${table}_TABLE_SUCCESS`, payload: res}))
      .catch(error => dispatch({type: `REQUEST_${table}_TABLE_FAILED`, payload: error}));
  });
};

const requestTable = (table) => (dispatch) => {
  dispatch({type: `REQUEST_${table}_TABLE_PENDING`});
  getTable(table)
    .then(res => dispatch({type: `REQUEST_${table}_TABLE_SUCCESS`, payload: res}))
    .catch(error => dispatch({type: `REQUEST_${table}_TABLE_FAILED`, payload: error}));
};

export {
  requestTable,
  requestTables
};
