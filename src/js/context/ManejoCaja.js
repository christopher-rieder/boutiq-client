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

/** Obtener caja actual. Se obtiene en base al día actual en el servidor.
 *  Si existe una caja cuya fecha sea hoy, devolver los datos.
 *  Si no existe, es porque no hay caja actual y hay que crearla.
 */
const requestCajaActual = () => (dispatch) => {
  dispatch({type: 'REQUEST_CAJA_PENDING'});
  getCajaActual()
    .then(cajaActual => {
      dispatch({type: 'REQUEST_CAJA_SUCCESS', payload: cajaActual});

      // si la caja no existe, cajaActual es undefined
      // de todas maneras se hace el primer dispatch, para indicar
      // que el request a la base de dato fue exitoso y en la base
      // no hay caja cargada del día actual.
      if (cajaActual) {
        // la caja esta abierta si fechaHoraCierre es falsy
        const cajaAbierta = !(cajaActual.fechaHoraCierre);
        if (cajaAbierta) dispatch({type: 'SET_MODO_CONSULTA_OFF'});
      }
    })
    .catch(error => dispatch({type: 'REQUEST_CAJA_FAILED', payload: error}));
};

/** Volver a null los valores de cierre, para reabrir la caja.
 *  Escribir esos datos en el servidor.
 *  El metodo pisa todo los datos, asi que reescribe los datos
 *  ya existentes con los mismos valores, excepto los valores puestos a null.
 * @param {*} caja caja actual
 */
const _reAbrirCaja = (caja) => (dispatch) => {
  const newCaja = {
    ...caja,
    montoCierre: null,
    fechaHoraCierre: null,
    montoDiscrepancia: null,
    razonDiscrepancia: null
  };
  postObjectToAPI(newCaja, 'CAJA')
    .then(() => {
      dispatch({type: 'RE_ABRIR_CAJA', payload: newCaja});
      dispatch({type: 'SET_MODO_CONSULTA_OFF'});
    })
    .catch(error => console.log(error));
};

/** Abrir caja del dia. Tiene un campo que es la fecha actual, formateado como un string
 *  con el formato especificado por DATE_FORMAT_STRING.
 *  Tambien guarda el instante preciso en que se abre la caja, en formato UNIX EPOCH
 * @param {*} montoInicial monto inicial con que abrir la caja.
 */
const _abrirCaja = (montoInicial) => (dispatch) => {
  const newCaja = {
    montoInicial,
    fecha: format(new Date(), DATE_FORMAT_STRING),
    fechaHoraInicio: new Date().getTime()
  };
  postObjectToAPI(newCaja, 'CAJA')
    .then(lastId => {
      dispatch({type: 'ABRIR_CAJA_DIARIA', payload: {...newCaja, id: lastId.lastId}});
      dispatch({type: 'SET_MODO_CONSULTA_OFF'});
    })
    .catch(error => console.log(error)); // TODO: REFLECT IN STATE THE ERROR
};

// CAJA DIARIA: COMPUESTA POR UNO O MAS TURNOS
const mapStateToProps = state => ({
  id: state.caja.id,
  montoInicial: state.caja.montoInicial,
  fechaHoraInicio: state.caja.fechaHoraInicio,
  montoCierre: state.caja.montoCierre,
  fechaHoraCierre: state.caja.fechaHoraCierre,
  montoDiscrepancia: state.caja.montoDiscrepancia,
  razonDiscrepancia: state.caja.razonDiscrepancia,
  cajaIniciada: !!(state.caja.fechaHoraInicio),
  cajaCerrada: !!(state.caja.fechaHoraCierre),
  cajaPending: state.caja.cajaPending,
  error: state.caja.error,
  turnos: state.caja.turnos
});

const mapDispatchToProps = dispatch => ({
  onRequestCajaActual: () => dispatch(requestCajaActual()),
  abrirCaja: (montoInicial) => dispatch(_abrirCaja(montoInicial)),
  reAbrirCaja: (caja) => dispatch(_reAbrirCaja(caja)),
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

function ManejoCaja ({cajaPending, onRequestCajaActual, error, abrirCaja, reAbrirCaja,
  id, fecha, montoInicial, fechaHoraInicio, cajaIniciada,
  cerrarCaja, montoCierre, fechaHoraCierre, cajaCerrada,
  montoDiscrepancia, razonDiscrepancia, registarDiscrepanciaCaja,
  turnos, abrirTurno, cerrarTurno, registarDiscrepanciaTurno
}) {
  // 1) chequear caja del dia. si esta abierta, cargar de base de datos.
  //    si esta cerrada, pedir monto inicial de caja.
  useEffect(() => {
    if (cajaIniciada === false) {
      onRequestCajaActual();
    }
  }, []);

  // returns an object that represent the current caja that
  // needs to go to the database
  function getCaja () {
    return {
      id,
      fecha,
      montoInicial,
      fechaHoraInicio,
      montoCierre,
      fechaHoraCierre,
      montoDiscrepancia,
      razonDiscrepancia
    };
  }

  // ============== return statements ==============
  // mostrar error si existe
  if (error) return <div className='error'>{error}</div>;
  // spinner mientras se espera la respuesta de la base de datos
  if (cajaPending) return <Spinner />;
  // si la caja no esta iniciada, pedir monto inicial.
  if (!cajaIniciada) return <AbrirCaja abrirCaja={abrirCaja} />;

  if (cajaCerrada) {
    dialogs.confirm(
      confirmed => {
        if (confirmed) {
          reAbrirCaja(getCaja());
        }
      }, // Callback
      `Caja cerrada. Reabrir?`, // Message text
      'SI', // Confirm text
      'NO' // Cancel text
    );
    return <div className='nothing' />;
  }
}

function AbrirCaja ({abrirCaja}) {
  const [montoInitialState, setMontoInitialState] = useState(0);

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

export default connect(mapStateToProps, mapDispatchToProps)(ManejoCaja);
