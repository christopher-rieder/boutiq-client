const initialState = {
  clientePending: true,
  proveedorPending: true,
  errorCliente: '',
  errorProveedor: ''
};

const defaultsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_CLIENTE_DEFAULT_PENDING':
      return { ...state, clientePending: true };
    case 'REQUEST_CLIENTE_DEFAULT_SUCCESS':
      return { ...state, clienteDefault: action.payload, clientePending: false };
    case 'REQUEST_CLIENTE_DEFAULT_FAILED':
      return { ...state, errorCliente: action.payload, clientePending: false };

    case 'REQUEST_PROVEEDOR_DEFAULT_PENDING':
      return { ...state, proveedorPending: true };
    case 'REQUEST_PROVEEDOR_DEFAULT_SUCCESS':
      return { ...state, proveedorDefault: action.payload, proveedorPending: false };
    case 'REQUEST_PROVEEDOR_DEFAULT_FAILED':
      return { ...state, errorProveedor: action.payload, proveedorPending: false };

    default:
      return state;
  }
};

export default defaultsReducer;
