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

const setTipoDePago = (state, payload) => {
  return { ...state, tipoPago: payload };
};

const setDescuento = (state, payload) => {
  return { ...state, descuento: payload };
};

const addItem = (state, payload) => {
  return state;
};

const removeItem = (state, payload) => {
  return state;
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
    default:
      return state;
  }
};

export default {
  reducer,
  initialState
};
