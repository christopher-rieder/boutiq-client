const initialState = {
  cliente: {id: 0, NOMBRE: ''},
  observaciones: '',
  numeroSeña: 0,
  monto: 0,
  items: []
};

const addItem = (state, articulo) => {
  const newItem = {
    id: articulo.id,
    CANTIDAD: 1,
    CODIGO: articulo.CODIGO,
    DESCRIPCION: articulo.DESCRIPCION,
    PRECIO_UNITARIO: articulo.PRECIO_LISTA,
    STOCK: articulo.STOCK
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

const setCantidadIndividual = (state, {articulo, value}) => {
  let newCantidad = isNaN(parseInt(value)) ? 1 : value > 0 ? parseInt(value) : 1;
  const newItem = {...articulo, CANTIDAD: newCantidad};
  return {
    ...state,
    items: state.items.map(item => item.CODIGO === newItem.CODIGO
      ? newItem
      : item)
  };
};

const removeItem = (state, articulo) => {
  return {
    ...state,
    items: state.items.filter(e => e.CODIGO !== articulo.CODIGO)
  };
};

const señaReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'seña_nueva':
      return {
        ...state,
        ...action.payload
      };
    case 'seña_vaciar':
      return {
        ...state,
        observaciones: '',
        items: [],
        monto: 0
      };
    case 'seña_setCliente':
      return { ...state, cliente: action.payload };
    case 'seña_setObservaciones':
      return { ...state, observaciones: action.payload };
    case 'seña_setMonto':
      return { ...state, monto: action.payload };
    case 'seña_addItem':
      return addItem(state, action.payload);
    case 'seña_removeItem':
      return removeItem(state, action.payload);
    case 'seña_addOneQuantityItem':
      return addOneQuantityItem(state, action.payload);
    case 'seña_setCantidadIndividual':
      return setCantidadIndividual(state, action.payload);
    case 'REQUEST_LAST_SEÑA_PENDING':
      return { ...state, isPending: true };
    case 'REQUEST_LAST_SEÑA_SUCCESS':
      return { ...state, numeroSeña: action.payload.lastId + 1, isPending: false };
    case 'REQUEST_LAST_SEÑA_FAILED':
      return { ...state, error: action.payload, isPending: false };
    default:
      return state;
  }
};

export {
  señaReducer
};
