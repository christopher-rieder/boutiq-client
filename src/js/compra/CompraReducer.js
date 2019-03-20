const compraInitialState = {
  proveedor: {id: 0, NOMBRE: ''},
  vendedor: {id: 0, NOMBRE: ''},
  turno: {id: 0},
  observaciones: '',
  numeroCompra: 0,
  isPending: true,
  items: []
};

const addItem = (state, articulo) => {
  const newItem = {
    id: articulo.id,
    CANTIDAD: 1,
    AÑADE_STOCK: true,
    CODIGO: articulo.CODIGO,
    DESCRIPCION: articulo.DESCRIPCION,
    STOCK: articulo.STOCK
  };

  return {
    ...state,
    items: state.items.concat(newItem)
  };
};

const removeItem = (state, articulo) => {
  return {
    ...state,
    items: state.items.filter(e => e.CODIGO !== articulo.CODIGO)
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

const setCantidadIndividual = (state, {articulo, value}) => {
  let newCantidad = isNaN(parseInt(value)) ? 1 : value > 0 ? parseInt(value) : 1;
  return {
    ...state,
    items: state.items.map(item => item.CODIGO === articulo.CODIGO
      ? {...articulo, CANTIDAD: newCantidad}
      : item)
  };
};

const compraReducer = (state = compraInitialState, action) => {
  switch (action.type) {
    case 'compra_nueva':
      return {
        ...state,
        ...action.payload
      };
    case 'compra_vaciar':
      return {
        ...state,
        observaciones: '',
        items: []
      };

    case 'compra_setProveedor':
      return { ...state, proveedor: action.payload };
    case 'compra_setObservaciones':
      return { ...state, observaciones: action.payload };
    case 'compra_addItem':
      return addItem(state, action.payload);
    case 'compra_removeItem':
      return removeItem(state, action.payload);
    case 'compra_addOneQuantityItem':
      return addOneQuantityItem(state, action.payload);
    case 'compra_setCantidadIndividual':
      return setCantidadIndividual(state, action.payload);
    case 'REQUEST_LAST_COMPRA_PENDING':
      return { ...state, isPending: true };
    case 'REQUEST_LAST_COMPRA_SUCCESS':
      return { ...state, numeroCompra: action.payload.lastId + 1, isPending: false };
    case 'REQUEST_LAST_COMPRA_FAILED':
      return { ...state, error: action.payload, isPending: false };
    default:
      return state;
  }
};

export {
  compraReducer,
  compraInitialState
};
