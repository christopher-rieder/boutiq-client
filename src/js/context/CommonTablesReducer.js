const initialState = {
  marca: [],
  rubro: [],
  estadoPago: [],
  tipoPago: [],
  articulo: [], // TODO: it's a big table... maybe move the table to redis
  marcaPending: true,
  rubroPending: true,
  estadoPagoPending: true,
  tipoPagoPending: true,
  articuloPending: true,
  errorMarca: '',
  errorRubro: '',
  errorEstadoPago: '',
  errorTipoPago: '',
  errorArticulo: ''
};

const commonTablesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_MARCA_TABLE_PENDING':
      return { ...state, marcaPending: true };
    case 'REQUEST_MARCA_TABLE_SUCCESS':
      return { ...state, marca: action.payload, marcaPending: false };
    case 'REQUEST_MARCA_TABLE_FAILED':
      return { ...state, errorMarca: action.payload, marcaPending: false };

    case 'REQUEST_RUBRO_TABLE_PENDING':
      return { ...state, rubroPending: true };
    case 'REQUEST_RUBRO_TABLE_SUCCESS':
      return { ...state, rubro: action.payload, rubroPending: false };
    case 'REQUEST_RUBRO_TABLE_FAILED':
      return { ...state, errorRubro: action.payload, rubroPending: false };

    case 'REQUEST_ESTADO_PAGO_TABLE_PENDING':
      return { ...state, estadoPagoPending: true };
    case 'REQUEST_ESTADO_PAGO_TABLE_SUCCESS':
      return { ...state, estadoPago: action.payload, estadoPagoPending: false };
    case 'REQUEST_ESTADO_PAGO_TABLE_FAILED':
      return { ...state, errorEstadoPago: action.payload, estadoPagoPending: false };

    case 'REQUEST_TIPO_PAGO_TABLE_PENDING':
      return { ...state, tipoPagoPending: true };
    case 'REQUEST_TIPO_PAGO_TABLE_SUCCESS':
      return { ...state, tipoPago: action.payload, tipoPagoPending: false };
    case 'REQUEST_TIPO_PAGO_TABLE_FAILED':
      return { ...state, errorTipoPago: action.payload, tipoPagoPending: false };

    case 'REQUEST_ARTICULO_FULL_TABLE_PENDING':
      return { ...state, articuloPending: true };
    case 'REQUEST_ARTICULO_FULL_TABLE_SUCCESS':
      return { ...state, articulo: action.payload, articuloPending: false };
    case 'REQUEST_ARTICULO_FULL_TABLE_FAILED':
      return { ...state, errorArticulo: action.payload, articuloPending: false };
    case 'UPDATE_ARTICULO_CANTIDAD':
      return {
        ...state,
        articulo: state.articulo.map(
          articulo => articulo.id === action.payload.id
            ? {...articulo,
              stock: action.payload.suma
                ? articulo.stock + action.payload.cantidad
                : articulo.stock - action.payload.cantidad}
            : articulo)
      };
    case 'UPDATE_ARTICULO':
      return {
        ...state,
        articulo: state.articulo.map(
          articulo => articulo.id === action.payload.id
            ? {...action.payload}
            : articulo)
      };
    case 'ADD_ARTICULO':
      return {
        ...state,
        articulo: state.articulo.concat(action.payload)
      };

    default:
      return state;
  }
};

export default commonTablesReducer;
