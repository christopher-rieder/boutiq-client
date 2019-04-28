import { round } from '../utilities/math';

const ventaInitialState = {
  descuento: 0,
  cliente: {id: 0, nombre: ''},
  vendedor: {id: 0, nombre: ''},
  turno: {id: 0},
  tipoPago: {},
  observaciones: '',
  numeroFactura: 0,
  pagos: [],
  isPending: false,
  error: '',
  items: []
};

const calculatePrices = (articulo, descuento, tipoPago) => {
  const accessor = tipoPago.listaDePrecio;
  return {
    ...articulo,
    precioBase: articulo[accessor],
    precioUnitario: articulo.precioCustom ||
                     round(articulo[accessor] * (1 - descuento / 100) * (1 - articulo.descuento / 100))
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

  const newItem = {...articulo, descuento: newDescuento, precioCustom: undefined};
  return {
    ...state,
    items: state.items.map(item => item.codigo === newItem.codigo
      ? calculatePrices(newItem, state.descuento, state.tipoPago)
      : item)
  };
};

const setCantidadIndividual = (state, {articulo, value}) => {
  let newCantidad = isNaN(parseInt(value)) ? 1 : value > 0 ? parseInt(value) : 1;
  const newItem = {...articulo, cantidad: newCantidad};
  return {
    ...state,
    items: state.items.map(item => item.codigo === newItem.codigo
      ? calculatePrices(newItem, state.descuento, state.tipoPago)
      : item)
  };
};

const setPrecioIndividual = (state, {articulo, value}) => {
  const newPrecio = isNaN(parseFloat(value))
    ? round(articulo.precioBase)
    : round(parseFloat(value));
  const newDescuento = round(100 - (newPrecio / articulo.precioBase * (1 - state.descuento / 100)) * 100);
  const newItem = {...articulo, descuento: newDescuento, precioCustom: newPrecio, precioUnitario: newPrecio};
  return {
    ...state,
    items: state.items.map(item => item.codigo === newItem.codigo
      ? calculatePrices(newItem, state.descuento, state.tipoPago)
      : item)
  };
};

const addItem = (state, articulo) => {
  const accessor = state.tipoPago.listaDePrecio;
  const newItem = {
    id: articulo.id,
    cantidad: 1,
    removeStock: true,
    codigo: articulo.codigo,
    descripcion: articulo.descripcion,
    stock: articulo.stock,
    precioBase: articulo[accessor],
    precioContado: articulo.precioContado,
    precioLista: articulo.precioLista,
    precioUnitario: round(articulo[accessor] * (1 - state.descuento / 100) * (1 - articulo.descuento / 100)),
    precioTotal: round(articulo[accessor] * (1 - state.descuento / 100) * (1 - articulo.descuento / 100)),
    descuento: articulo.descuento
  };

  return {
    ...state,
    items: state.items.concat(newItem)
  };
};

const addOneQuantityItem = (state, codigo) => {
  return {
    ...state,
    items: state.items.map(item => item.codigo === codigo
      ? {...item, cantidad: item.cantidad + 1}
      : item)
  };
};

const removeItem = (state, articulo) => {
  return {
    ...state,
    items: state.items.filter(e => e.codigo !== articulo.codigo)
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
    case 'REQUEST_LAST_VENTA_PENDING':
      return { ...state, isPending: true };
    case 'REQUEST_LAST_VENTA_SUCCESS':
      return { ...state, numeroFactura: action.payload.lastId + 1, isPending: false };
    case 'REQUEST_LAST_VENTA_FAILED':
      return { ...state, error: action.payload, isPending: false };
    default:
      return state;
  }
};

export {
  ventaReducer,
  ventaInitialState
};
