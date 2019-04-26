// const vendedor = await getItemById('vendedor', 1);
// const turno = await getTurnoActual();

const initialState = {
  error: '',
  sessionPending: true,
  vendedor: {},
  turnoIniciado: false,
  modoConsulta: true,
  modoAdmin: false
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_TURNO_PENDING':
      return { ...state, sessionPending: true };
    case 'REQUEST_TURNO_SUCCESS':
      if (action.payload) {
        return { // bring turno stored in database
          ...state,
          vendedor: action.payload.vendedor,
          sessionPending: false,
          turnoIniciado: true
        };
      } else { // don't initialize turno from database
        return { // initialization is done on Login, taking user input.
          ...state,
          sessionPending: false
        };
      }
    case 'REQUEST_TURNO_FAILED':
      return { ...state, error: 'Error al cargar turno:\n' + action.payload, sessionPending: false };
    case 'ABRIR_TURNO':
      return {
        ...state,
        vendedor: action.payload.vendedor,
        permissions: action.payload.permissions,
        turnoIniciado: true
      };
    case 'CERRAR_TURNO':
      return {
        ...state,
        vendedor: null,
        turnoIniciado: false,
        modoConsulta: true,
        modoAdmin: false
      };
    case 'SET_MODO_CONSULTA_ON':
      return {
        ...state,
        modoConsulta: true
      };
    case 'SET_MODO_CONSULTA_OFF':
      return {
        ...state,
        modoConsulta: false
      };
    default:
      return state;
  }
};

export default sessionReducer;
