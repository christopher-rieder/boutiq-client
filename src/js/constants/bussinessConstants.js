import * as databaseRead from '../database/getData';

async function getTiposDePago () {
  return databaseRead.getTable('TIPO_PAGO');
}

const descuentoMax = 80; // this would be 80%, or 0.8;

export {
  getTiposDePago,
  descuentoMax
};
