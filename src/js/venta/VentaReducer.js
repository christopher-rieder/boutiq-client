import { round } from '../utilities/math';

const ventaInitialState = {
  descuento: 0,
  cliente: {id: 0, NOMBRE: ''},
  vendedor: {id: 0, NOMBRE: ''},
  turno: {id: 0},
  tipoPago: {},
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
  const accessor = state.tipoPago.LISTA_DE_PRECIO;
  const newItem = {
    id: articulo.id,
    CANTIDAD: 1,
    REMOVE_STOCK: true,
    CODIGO: articulo.CODIGO,
    DESCRIPCION: articulo.DESCRIPCION,
    STOCK: articulo.STOCK,
    PRECIO_BASE: articulo[accessor],
    PRECIO_CONTADO: articulo.PRECIO_CONTADO,
    PRECIO_LISTA: articulo.PRECIO_LISTA,
    PRECIO_UNITARIO: round(articulo[accessor] * (1 - state.descuento / 100) * (1 - articulo.DESCUENTO / 100)),
    PRECIO_TOTAL: round(articulo[accessor] * (1 - state.descuento / 100) * (1 - articulo.DESCUENTO / 100)),
    DESCUENTO: articulo.DESCUENTO
  };

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

const ventaReducer = (state = ventaInitialState, action) => {
  switch (action.type) {
    case 'venta_nueva':
      return {
        ...state,
        ...action.payload
      };
    case 'venta_vaciar':
      return {
        ...state,
        observaciones: '',
        items: [],
        pagos: [],
        descuento: 0
      };
    case 'venta_setCliente':
      return { ...state, cliente: action.payload };
    case 'venta_setObservaciones':
      return { ...state, observaciones: action.payload };
    case 'venta_addPago':
      return { ...state, pagos: state.pagos.concat(action.payload) };
    case 'venta_removePago':
      return { ...state };
    case 'venta_setDescuento':
      return setDescuento(state, action.payload);
    case 'venta_setTipoPago':
      return setTipoDePago(state, action.payload);
    case 'venta_addItem':
      return addItem(state, action.payload);
    case 'venta_removeItem':
      return removeItem(state, action.payload);
    case 'venta_addOneQuantityItem':
      return addOneQuantityItem(state, action.payload);
    case 'venta_setDescuentoIndividual':
      return setDescuentoIndividual(state, action.payload);
    case 'venta_setCantidadIndividual':
      return setCantidadIndividual(state, action.payload);
    case 'venta_setPrecioIndividual':
      return setPrecioIndividual(state, action.payload);
    default:
      return state;
  }
};

export {
  ventaReducer,
  ventaInitialState
};
