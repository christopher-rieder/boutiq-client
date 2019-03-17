const initialState = {
  montoInicial: 0,
  montoCierre: 0,
  discrepancia: {monto: 0, razon: ''},
  cajaIniciada: false,
  cajaCerrada: false,
  turnos: []
};

const cajaDiariaReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ABRIR_CAJA_DIARIA':
      return {
        ...state,
        montoInicial: action.payload,
        cajaIniciada: true
      };
    case 'CERRAR_CAJA_DIARIA':
      return {
        ...state,
        montoCierre: action.payload,
        cajaCerrada: true
      };
    case 'REGISTRAR_DISCREPANCIA_CAJA_DIARIA':
      return {
        ...state,
        discrepancia: action.payload
      };
    case 'AGREGAR_TURNO_DIARIO':
      return {
        ...state,
        turnos: state.turnos.concat(action.payload)
      };
    default:
      return state;
  }
};
// TODO: Que pasa si inician mal la caja? O si no la inician?
// TODO: Que pasa si no cierran la caja? O si no la cierran?
// ASOCIAR TICKETS DE POSNETS ??? ASOCIADOS A TURNO...
export default cajaDiariaReducer;
