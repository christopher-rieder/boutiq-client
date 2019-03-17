// const vendedor = await getItemById('vendedor', 1);
// const turno = await getTurnoActual();

const initialState = {
  vendedor: {id: 0, NOMBRE: ''},
  vendedorPending: true,
  errorVendedor: '',
  turno: {id: 0},
  permissions: {}
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_VENDEDOR_PENDING':
      return { ...state, vendedorPending: true };
    case 'REQUEST_VENDEDOR_SUCCESS':
      return { ...state, vendedor: action.payload, vendedorPending: false };
    case 'REQUEST_VENDEDOR_FAILED':
      return { ...state, errorVendedor: action.payload, vendedorPending: false };
    default:
      return state;
  }
};

export default sessionReducer;
