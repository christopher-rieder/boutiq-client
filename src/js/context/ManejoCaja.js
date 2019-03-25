import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { UncontrolledInput, InputTextField, InputSelect, InputFloatField } from '../components/inputs';
import Button from '@material-ui/core/Button';
import MoneyIcon from '@material-ui/icons/MonetizationOnTwoTone';
import dialogs from '../utilities/dialogs';
import {getCajaActual} from '../database/getData';
import Spinner from '../components/Spinner';
import { postObjectToAPI } from '../database/writeData';
import {format} from 'date-fns';
const DATE_FORMAT_STRING = 'yyyy/MM/dd';

const requestCajaActual = () => (dispatch) => {
  dispatch({type: 'REQUEST_CAJA_PENDING'});
  getCajaActual()
    .then(cajaActual => dispatch({type: 'REQUEST_CAJA_SUCCESS', payload: cajaActual}))
    .catch(error => dispatch({type: 'REQUEST_CAJA_FAILED', payload: error}));
};

const abrirCaja = (montoInicial) => (dispatch) => {
  const newCaja = {
    montoInicial,
    fecha: format(new Date(), DATE_FORMAT_STRING),
    fechaHoraInicio: new Date().getTime()
  };
  postObjectToAPI(newCaja, 'CAJA')
    .then(cajaId => dispatch({type: 'ABRIR_CAJA_DIARIA', payload: {...newCaja, id: cajaId}}))
    .catch(error => console.log(error)); // TODO: REFLECT IN STATE THE ERROR
};

// CAJA DIARIA: COMPUESTA POR UNO O MAS TURNOS
const mapStateToProps = state => ({
  montoInicial: state.caja.montoInicial,
  fechaHoraInicio: state.caja.fechaHoraInicio,
  montoCierre: state.caja.montoCierre,
  fechaHoraCierre: state.caja.fechaHoraCierre,
  discrepancia: state.caja.discrepancia,
  cajaIniciada: state.caja.cajaIniciada,
  cajaCerrada: state.caja.cajaCerrada,
  cajaPending: state.caja.cajaPending,
  turnos: state.caja.turnos
});

const mapDispatchToProps = dispatch => ({
  onRequestCajaActual: () => dispatch(requestCajaActual()),
  abrirCaja: (montoInicial) => dispatch(abrirCaja(montoInicial)),
  // abrirCaja: (monto) => dispatch({type: 'ABRIR_CAJA_DIARIA', payload: monto}),
  cerrarCaja: (monto) => (dispatch) => {
    dispatch({type: 'CERRAR_CAJA_DIARIA', payload: monto});
  },
  registarDiscrepanciaCaja: (discrepancia) => (dispatch) => {
    dispatch({type: 'REGISTRAR_DISCREPANCIA_CAJA_DIARIA', payload: discrepancia});
  },
  // TURNO
  abrirTurno: (turno) => (dispatch) => {
    dispatch({type: 'ABRIR_TURNO', payload: turno});
  },
  cerrarTurno: (turno) => (dispatch) => {
    dispatch({type: 'CERRAR_TURNO', payload: turno});
  },
  registarDiscrepanciaTurno: (discrepancia) => (dispatch) => {
    dispatch({type: 'REGISTRAR_DISCREPANCIA_TURNO', payload: discrepancia});
  }
});

function ManejoCaja ({cajaPending, onRequestCajaActual,
  abrirCaja, montoInicial, fechaHoraInicio, cajaIniciada,
  cerrarCaja, montoCierre, fechaHoraCierre, cajaCerrada,
  discrepancia, registarDiscrepanciaCaja,
  turnos, abrirTurno, cerrarTurno, registarDiscrepanciaTurno
}) {
  const [montoInitialState, setMontoInitialState] = useState(0);

  useEffect(() => {
    if (cajaIniciada === false) {
      onRequestCajaActual();
    }
  }, []);

  const handleAbrirCaja = () => {
    dialogs.confirm(
      confirmed => {
        if (confirmed) {
          abrirCaja(montoInitialState);
        }
      }, // Callback
      `Es ${montoInitialState} el monto inicial correcto?`, // Message text
      'SI', // Confirm text
      'NO' // Cancel text
    );
  };

  // return statements

  if (cajaPending) {
    return <Spinner />;
  }

  if (!cajaIniciada) {
    return (
      <div className='manejo-caja__abrir-caja'>
        <p>Abrir caja</p>
        <InputFloatField name='Monto' value={montoInitialState} setValue={setMontoInitialState} autoComplete='off' />
        <Button variant='contained' color='primary' onClick={handleAbrirCaja}>
          Abrir Caja &nbsp;
          <MoneyIcon />
        </Button>
      </div>
    );
  }

  return <div className='error'>ERROR</div>;
}

export default connect(mapStateToProps, mapDispatchToProps)(ManejoCaja);

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
