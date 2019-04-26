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

function Logout () {
  const [montoCierre, setMontoCierre] = useState(0);

  return (
    <React.Fragment>
      <p>Plata al cerrar el turno: </p>
      <InputFloatField name='Monto' value={montoCierre} setValue={setMontoCierre} autoComplete='off' />
      <Button variant='outlined' color='primary' onClick={null} >
          CERRAR TURNO &nbsp;
        <SendIcon />
      </Button>
    </React.Fragment>
  );
}

export default Logout;
