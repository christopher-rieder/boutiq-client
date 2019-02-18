const articuloColumns = [
  'id',
  'CODIGO',
  'DESCRIPCION',
  'PRECIO_LISTA',
  'PRECIO_CONTADO',
  'PRECIO_COSTO',
  'STOCK',
  'RUBRO_ID',
  'MARCA_ID',
  'PROMO_BOOL',
  'DESCUENTO_PROMO'];

const articuloColumsnConfig = {
  'id': {type: 'id'},
  'CODIGO': {type: 'text'},
  'DESCRIPCION': {type: 'text'},
  'PRECIO_LISTA': {type: 'float'},
  'PRECIO_CONTADO': {type: 'float'},
  'PRECIO_COSTO': {type: 'float'},
  'STOCK': {type: 'integer'},
  'RUBRO_ID': {type: 'select'},
  'MARCA_ID': {type: 'select'},
  'PROMO_BOOL': {type: 'boolean'},
  'DESCUENTO_PROMO': {type: 'float'}
};

export {
  articuloColumns,
  articuloColumsnConfig
};
