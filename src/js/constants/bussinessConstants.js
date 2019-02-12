const TARJETA = 'TARJETA';
const EFECTIVO = 'EFECTIVO';
const DEBITO = 'DEBITO';
const CREDITO_PROPIO = 'CREDITO_PROPIO';

const condicionesPago = {TARJETA, EFECTIVO, DEBITO, CREDITO_PROPIO};
const descuentoMax = 80; // this would be 80%, or 0.8;

export {
  condicionesPago,
  descuentoMax
};
