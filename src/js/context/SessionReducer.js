// const vendedor = await getItemById('vendedor', 1);
// const turno = await getTurnoActual();

const initialState = {
  error: '',
  sessionPending: true,
  vendedor: {},
  permissions: {},
  turnoIniciado: false
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_SESSION_PENDING':
      return { ...state, sessionPending: true };
    case 'REQUEST_SESSION_SUCCESS':
      return { ...state, turno: action.payload.turno, sessionPending: false };
    case 'REQUEST_SESSION_FAILED':
      return { ...state, error: action.payload, sessionPending: false };
    case 'ABRIR_TURNO':
      return {
        ...state,
        vendedor: action.payload.vendedor,
        permissions: action.payload.permissions,
        turnoIniciado: true
      };
    default:
      return state;
  }
};

export default sessionReducer;
