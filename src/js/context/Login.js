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

const requestTurnoActual = () => (dispatch) => {
  dispatch({type: 'REQUEST_TURNO_PENDING'});
  getTurnoActual()
    .then(turnoActual => {
      dispatch({type: 'REQUEST_TURNO_SUCCESS', payload: turnoActual});
    })
    .catch(error => dispatch({type: 'REQUEST_TURNO_FAILED', payload: error}));
};

const abrirTurno = (vendedor, permissions, montoInicial, cajaId) => (dispatch) => {
  const fechaHoraInicio = new Date().getTime();
  postObjectToAPI({
    cajaId,
    vendedorId: vendedor.id,
    montoInicial,
    fechaHoraInicio
  }, 'TURNO')
    .then(turnoId => dispatch({type: 'ABRIR_TURNO', payload: {permissions, montoInicial, fechaHoraInicio, vendedor, id: turnoId}}))
    .catch(error => console.log(error)); // TODO: REFLECT IN STATE THE ERROR
};

const mapStateToProps = state => ({
  cajaId: state.caja.id,
  fechaHoraInicio: state.caja.fechaHoraInicio
});

const mapDispatchToProps = dispatch => ({
  onTurnoRequest: () => dispatch(requestTurnoActual()),
  vendedorLogin: (vendedor, permissions, montoInicial, cajaId) => {
    dispatch(abrirTurno(vendedor, permissions, montoInicial, cajaId));
  }
});

function Login ({vendedorLogin, cajaId, onTurnoRequest}) {
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<Consulta />);
  const [vendedor, setVendedor] = useState({});
  const [montoInitialState, setMontoInitialState] = useState(0);

  useEffect(() => {
    onTurnoRequest();
  }, []);

  const handleLogin = () => {
    // TODO: GET PERMISSIONS
    vendedorLogin(vendedor, null, montoInitialState, cajaId);
  };

  const vendedorModal = () => {
    setModalContent(
      <Consulta
        table='vendedor'
        columnsWidths={[40, 400, 120, 120, 120]}
        setDisplayModal={setDisplayModal}
        handleSelection={setVendedor} />
    );
    setDisplayModal(true);
  };

  return (
    <React.Fragment>
      {
        displayModal && <Modal displayModal={displayModal} setDisplayModal={setDisplayModal}>
          {modalContent}
        </Modal>
      }
      <InputTextField name='Vendedor' value={vendedor.NOMBRE} readOnly onClick={vendedorModal} />
      <Button variant='outlined' color='primary' onClick={handleLogin} >
          LOGIN &nbsp;
        <SendIcon />
      </Button>
      <p>Plata al abrir el turno: </p>
      <InputFloatField name='Monto' value={montoInitialState} setValue={setMontoInitialState} autoComplete='off' />
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
