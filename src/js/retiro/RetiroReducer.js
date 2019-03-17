const initialState = {
  observaciones: '',
  numeroRetiro: 0,
  vendedor: {id: 0, NOMBRE: ''},
  turno: {id: 0},
  items: []
};

const addItem = (state, articulo) => {
  const newItem = {
    id: articulo.id,
    CANTIDAD: 1,
    REMOVE_STOCK: true,
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

const retiroReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'retiro_nuevo':
      return {
        ...state,
        ...action.payload
      };
    case 'retiro_vaciar':
      return {
        ...state,
        observaciones: '',
        items: []
      };
    case 'retiro_setObservaciones':
      return { ...state, observaciones: action.payload };
    case 'retiro_addItem':
      return addItem(state, action.payload);
    case 'retiro_removeItem':
      return removeItem(state, action.payload);
    case 'retiro_addOneQuantityItem':
      return addOneQuantityItem(state, action.payload);
    case 'retiro_setCantidadIndividual':
      return setCantidadIndividual(state, action.payload);
    case 'REQUEST_LAST_RETIRO_PENDING':
      return { ...state, isPending: true };
    case 'REQUEST_LAST_RETIRO_SUCCESS':
      return { ...state, numeroRetiro: action.payload.lastId + 1, isPending: false };
    case 'REQUEST_LAST_RETIRO_FAILED':
      return { ...state, error: action.payload, isPending: false };
    default:
      return state;
  }
};

export {
  retiroReducer
};
