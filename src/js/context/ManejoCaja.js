// CAJA DIARIA: COMPUESTA POR UNO O MAS TURNOS

const inicioCaja = (monto) => (dispatch) => {
  dispatch({type: 'ABRIR_CAJA_DIARIA', payload: monto});
};

const cierreCaja = (monto) => (dispatch) => {
  dispatch({type: 'CERRAR_CAJA_DIARIA', payload: monto});
};

const registarDiscrepancia = (discrepancia) => (dispatch) => {
  dispatch({type: 'REGISTRAR_DISCREPANCIA_CAJA_DIARIA', payload: discrepancia});
};

// TURNO
const inicioTurno = (turno) => (dispatch) => {
  dispatch({type: 'ABRIR_TURNO', payload: turno});
};

const cierreTurno = (turno) => (dispatch) => {
  dispatch({type: 'CERRAR_TURNO', payload: turno});
};

// TODO: LOS PAGOS CON CREDITO SE RINDEN EN ALGUN MOMENTO.
// TODO: ESTADOS DE PAGO. COBRADO | APROBADO | RECHAZADO ? VER STATE MACHINE

// ACTIONS:
// login.
// abrir turno. arqueo
// abrir caja (si es primer turno)
// ingresar movimientos de caja
// ingresar pagos en efectivo
// ingresar rendicion de pagos en credito
// cerrar turno. arqueo.
// abrir turno. arqueo
// no abrir caja (es segundo turno).
// ingresar movimientos de caja
// ingresar pagos en efectivo
// ingresar rendicion de pagos en credito
// cerrar turno. arqueo.
// preguntar por retiros al cerrar caja.
// cerrar caja.
