import {format} from 'date-fns';
import { postObjectToAPI } from '../database/writeData';
const DATE_FORMAT_STRING = 'yyyy/MM/dd';
const initialState = {
  cajaIniciada: false,
  cajaCerrada: false,
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
          cajaIniciada: true,
          cajaCerrada: !!(action.payload.fechaHoraCierre),
          // if fechaHoraCierre is not null, then caja is closed
          ...action.payload
        };
      } else { // don't initialize caja from database
        return { // initialization is done on ManejoCaja, taking user input.
          ...state,
          cajaPending: false,
          cajaIniciada: false
        };
      }
    case 'ABRIR_CAJA_DIARIA':
      return {
        ...state,
        ...action.payload,
        cajaIniciada: true
      };
    case 'CERRAR_CAJA_DIARIA':
      return {
        ...state,
        montoCierre: action.payload,
        cajaCerrada: true
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
    case 'REQUEST_TURNO_SUCCESS':
      return {
        ...state,
        turnos: state.turnos.concat(action.payload)
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
