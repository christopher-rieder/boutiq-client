
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

const retiroReducer = (state, action) => {
  switch (action.type) {
    case 'nuevo':
      return {
        ...state,
        ...action.payload
      };
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
  retiroReducer
};
