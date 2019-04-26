import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { UncontrolledInput, InputTextField, InputSelect, InputFloatField } from '../components/inputs';
import Button from '@material-ui/core/Button';
import MoneyIcon from '@material-ui/icons/MonetizationOnTwoTone';
import SendIcon from '@material-ui/icons/SendTwoTone';
import dialogs from '../utilities/dialogs';
import {getTurnoActual} from '../database/getData';
import Spinner from '../components/Spinner';
import Modal from '../components/modal';
import Consulta from '../crud/consulta';
import { postObjectToAPI } from '../database/writeData';

// turno fields:
const cerrarTurno = (lastTurno, montoCierre) => (dispatch) => {
  const fechaHoraCierre = new Date().getTime();
  const turno = {
    id: lastTurno.id,
    montoCierre,
    fechaHoraCierre
  };
  postObjectToAPI(turno, 'TURNO')
    .then(lastId => dispatch({type: 'CERRAR_TURNO', payload: {montoCierre, fechaHoraCierre}}));
};

const mapStateToProps = state => ({
  lastTurno: state.caja.turnos[state.caja.turnos.length - 1]
});

const mapDispatchToProps = dispatch => ({
  logout: (lastTurno, montoCierre) => {
    dispatch(cerrarTurno(lastTurno, montoCierre));
  }
});

function Logout ({
  logout,
  lastTurno
}) {
  const [montoCierre, setMontoCierre] = useState(0);

  function cierreTurno () {
    logout(lastTurno, montoCierre);
  }

  return (
    <React.Fragment>
      <p>Plata al cerrar el turno: </p>
      <InputFloatField name='Monto' value={montoCierre} setValue={setMontoCierre} autoComplete='off' />
      <Button variant='outlined' color='primary' onClick={cierreTurno} >
          CERRAR TURNO &nbsp;
        <SendIcon />
      </Button>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
