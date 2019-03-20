const initialState = {
  montoInicial: 0,
  fechaHoraInicio: null,
  montoCierre: 0,
  fechaHoraCierre: null,
  discrepancia: {monto: 0, razon: ''},
  cajaIniciada: false,
  cajaCerrada: false,
  turnos: []
};

// todas las transacciones tienen asociado un turno actual, obtenido del state.
// y cada turno tiene asociada una caja diaria.
// en base a esta estructura se pueden hacer reportes diarios o por turno.
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
    // case 'ABRIR_TURNO'
    // case 'CERRAR_TURNO'
    // case 'REGISTRAR_DISCREPANCIA_TURNO'
    default:
      return state;
  }
};
// TODO: Que pasa si inician mal la caja? Sí o sí hay que ingresar arqueo de caja.
// permitir correcciones mientras corre el turno actual?
// TODO: Que pasa si no cierran la caja? cerrar caja automáticamente si no quedo cerrada,
// a la hora 23:59 del dia que se abrió, con el monto calculado y una advertencia de que
// no se hizo arqueo de caja.
// TODO: NOTIFICATIONS QUEUE. que tiene que chequear el usuario o dueño.
export default cajaDiariaReducer;
