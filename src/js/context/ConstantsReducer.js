const updateConstants = (state, payload) => {
  let newState = { ...state, isPending: false };
  payload.forEach(row => {
    newState[row.NOMBRE] = row.VALOR;
  });
  return newState;
};

const initialState = {
  isPending: true,
  error: ''
};

const constantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_CONSTANTS_TABLE_PENDING':
      return { ...state, isPending: true };
    case 'REQUEST_CONSTANTS_TABLE_SUCCESS':
      return updateConstants(state, action.payload);
    case 'REQUEST_CONSTANTS_TABLE_FAILED':
      return { ...state, error: action.payload, isPending: false };
    default:
      return state;
  }
};

export default constantsReducer;
