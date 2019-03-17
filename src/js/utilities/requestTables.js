import { getTable } from '../database/getData';

const requestTables = () => (dispatch) => {
  const tablesToRequest = ['MARCA', 'RUBRO', 'ESTADO_PAGO', 'TIPO_PAGO', 'ARTICULO'];
  tablesToRequest.forEach(table => {
    dispatch({type: `REQUEST_${table}_TABLE_PENDING`});
    getTable(table)
      .then(res => dispatch({type: `REQUEST_${table}_TABLE_SUCCESS`, payload: res}))
      .catch(error => dispatch({type: `REQUEST_${table}_TABLE_FAILED`, payload: error}));
  });
};

const requestConstants = () => (dispatch) => {
  dispatch({type: 'REQUEST_CONSTANTS_PENDING'});
  getTable('CONSTANTS')
    .then(table => dispatch({type: 'REQUEST_CONSTANTS_SUCCESS', payload: table}))
    .catch(error => dispatch({type: 'REQUEST_CONSTANTS_FAILED', payload: error}));
};

export {
  requestTables,
  requestConstants
};
