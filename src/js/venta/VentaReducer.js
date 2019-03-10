import React, {createContext, useReducer} from 'react';
import { round } from '../utilities/math';

const initialState = {
  descuento: 0,
  cliente: {id: 0, NOMBRE: ''},
  vendedor: {id: 0, NOMBRE: ''},
  turno: {id: 0},
  tipoPago: {id: 0, NOMBRE: ''},
  observaciones: '',
  numeroFactura: 0,
  pagos: [],
  items: []
};

const calculatePrices = (articulo, descuento, tipoPago) => {
  const accessor = tipoPago.LISTA_DE_PRECIO;
  return {
    ...articulo,
    PRECIO_BASE: articulo[accessor],
    PRECIO_UNITARIO: articulo.PRECIO_CUSTOM ||
                     round(articulo[accessor] * (1 - descuento / 100) * (1 - articulo.DESCUENTO / 100))
  };
};

const setTipoDePago = (state, payload) => {
  return {
    ...state,
    tipoPago: payload,
    items: state.items.map(item => calculatePrices(item, state.descuento, payload))
  };
};

const setDescuento = (state, payload) => {
  return {
    ...state,
    descuento: payload,
    items: state.items.map(item => calculatePrices(item, payload, state.tipoPago))
  };
};

const setDescuentoIndividual = (state, {articulo, value}) => {
  const newDescuento = isNaN(parseFloat(value)) ? 0 : parseFloat(value);

  const newItem = {...articulo, DESCUENTO: newDescuento, PRECIO_CUSTOM: undefined};
  return {
    ...state,
    items: state.items.map(item => item.CODIGO === newItem.CODIGO
      ? calculatePrices(newItem, state.descuento, state.tipoPago)
      : item)
  };
};

const setCantidadIndividual = (state, {articulo, value}) => {
  let newCantidad = isNaN(parseInt(value)) ? 1 : value > 0 ? parseInt(value) : 1;
  const newItem = {...articulo, CANTIDAD: newCantidad};
  return {
    ...state,
    items: state.items.map(item => item.CODIGO === newItem.CODIGO
      ? calculatePrices(newItem, state.descuento, state.tipoPago)
      : item)
  };
};

const setPrecioIndividual = (state, {articulo, value}) => {
  const newPrecio = isNaN(parseFloat(value))
    ? round(articulo.PRECIO_BASE)
    : round(parseFloat(value));
  const newDescuento = round(100 - (newPrecio / articulo.PRECIO_BASE * (1 - state.descuento / 100)) * 100);
  const newItem = {...articulo, DESCUENTO: newDescuento, PRECIO_CUSTOM: newPrecio, PRECIO_UNITARIO: newPrecio};
  return {
    ...state,
    items: state.items.map(item => item.CODIGO === newItem.CODIGO
      ? calculatePrices(newItem, state.descuento, state.tipoPago)
      : item)
  };
};
const addItem = (state, articulo) => {
  const newItem = {...articulo};
  const accessor = state.tipoPago.LISTA_DE_PRECIO;

  // item initialization
  newItem.CANTIDAD = 1;

  newItem.PRECIO_BASE = newItem[accessor];
  newItem.PRECIO_UNITARIO = newItem.PRECIO_CUSTOM ||
                            round(newItem[accessor] * (1 - state.descuento / 100) * (1 - newItem.DESCUENTO / 100));

  return {
    ...state,
    items: state.items.concat(newItem)
  };
};

const addOneQuantityItem = (state, codigo) => {
  return {
    ...state,
    items: state.items.map(item => item.CODIGO === codigo
      ? {...item, CANTIDAD: item.CANTIDAD + 1}
      : item)
  };
};

const removeItem = (state, articulo) => {
  return {
    ...state,
    items: state.items.filter(e => e.CODIGO !== articulo.CODIGO)
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'nuevaFactura':
      return {
        ...state,
        ...action.payload
      };
    case 'setCliente':
      return { ...state, cliente: action.payload };
    case 'setObservaciones':
      return { ...state, observaciones: action.payload };
    case 'addPago':
      return { ...state, pagos: state.pagos.concat(action.payload) };
    case 'removePago':
      return { ...state };
    case 'setDescuento':
      return setDescuento(state, action.payload);
    case 'setTipoPago':
      return setTipoDePago(state, action.payload);
    case 'addItem':
      return addItem(state, action.payload);
    case 'removeItem':
      return removeItem(state, action.payload);
    case 'addOneQuantityItem':
      return addOneQuantityItem(state, action.payload);
    case 'setDescuentoIndividual':
      return setDescuentoIndividual(state, action.payload);
    case 'setCantidadIndividual':
      return setCantidadIndividual(state, action.payload);
    case 'setPrecioIndividual':
      return setPrecioIndividual(state, action.payload);
    default:
      return state;
  }
};

const VentaContext = createContext();

function VentaContextProvider (props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <VentaContext.Provider value={{state, dispatch}}>
      {props.children}
    </VentaContext.Provider>
  );
}

export {
  VentaContext,
  VentaContextProvider
};
