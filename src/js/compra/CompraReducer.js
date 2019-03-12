const compraInitialState = {
  proveedor: {id: 0, NOMBRE: ''},
  observaciones: '',
  numeroCompra: 0,
  items: []
};

const addItem = (state, articulo) => {
  const newItem = {
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

const compraReducer = (state, action) => {
  switch (action.type) {
    case 'nuevaCompra':
      return {
        ...state,
        ...action.payload
      };
    case 'setProveedor':
      return { ...state, proveedor: action.payload };
    case 'setObservaciones':
      return { ...state, observaciones: action.payload };
    case 'addItem':
      return addItem(state, action.payload);
    case 'removeItem':
      return removeItem(state, action.payload);
    case 'addOneQuantityItem':
      return addOneQuantityItem(state, action.payload);
    case 'setCantidadIndividual':
      return setCantidadIndividual(state, action.payload);
    default:
      return state;
  }
};

export {
  compraReducer,
  compraInitialState
};
