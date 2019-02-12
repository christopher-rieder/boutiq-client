import filterFunctions from '../utilities/filterFunctions';

export default {
  CODIGO: filterFunctions.anchoredTextFiltering(true, false),
  DESCRIPCION: filterFunctions.wordFiltering(true),
  MARCA: filterFunctions.anchoredTextFiltering(true, false), // TODO: make a dropdown list
  RUBRO: filterFunctions.anchoredTextFiltering(true, false), // TODO: make a dropdown list
  PRECIO_LISTA: filterFunctions.numberRangeFiltering(true),
  PRECIO_CONTADO: filterFunctions.numberRangeFiltering(true),
  PRECIO_COSTO: filterFunctions.numberRangeFiltering(true),
  PRECIO_PROMO: filterFunctions.numberRangeFiltering(true),
  STOCK: filterFunctions.numberRangeFiltering(true),
  PROMO_BOOL: filterFunctions.booleanFiltering()
};
