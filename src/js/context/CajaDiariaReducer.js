const initialState = {
  cajaPending: true,
  turnos: []
};

// todas las transacciones tienen asociado un turno actual, obtenido del state.
// y cada turno tiene asociada una caja diaria.
// en base a esta estructura se pueden hacer reportes diarios o por turno.
const cajaDiariaReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_CAJA_PENDING':
      return { ...state, cajaPending: true };
    case 'REQUEST_CAJA_FAILED':
      return { ...state, error: 'Error al cargar caja:\n' + action.payload, cajaPending: false };
    case 'REQUEST_CAJA_SUCCESS':
      if (action.payload) {
        return { // bring caja stored in database
          ...state,
          cajaPending: false,
          ...action.payload
        };
      } else { // don't initialize caja from database
        return { // initialization is done on ManejoCaja, taking user input.
          ...state,
          cajaPending: false
        };
      }
    case 'ABRIR_CAJA_DIARIA':
      return {
        ...state,
        ...action.payload
      };
    case 'CERRAR_CAJA_DIARIA':
      return {
        ...state,
        montoCierre: action.payload
      };
    case 'RE_ABRIR_CAJA':
      return {
        ...state,
        ...action.payload
      };
    case 'REGISTRAR_DISCREPANCIA_CAJA_DIARIA':
      return {
        ...state,
        discrepancia: action.payload
      };
    case 'ABRIR_TURNO':
      return {
        ...state,
        turnos: state.turnos.concat(action.payload)
      };
    case 'CERRAR_TURNO':
      const newTurnos = [...state.turnos];
      const lastTurno = newTurnos[newTurnos.length - 1];
      lastTurno.fechaHoraCierre = action.payload.fechaHoraCierre;
      lastTurno.montoCierre = action.payload.montoCierre;
      return {
        ...state,
        turnos: newTurnos
      };
    case 'REQUEST_TURNO_SUCCESS':
      if (action.payload) {
        return {
          ...state,
          turnos: state.turnos.concat(action.payload)
        };
      } else {
        return state;
      }
    // case 'REGISTRAR_DISCREPANCIA_TURNO'
    default:
      return state;
  }
};

export default cajaDiariaReducer;
