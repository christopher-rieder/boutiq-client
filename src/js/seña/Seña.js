import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import { UncontrolledInput, InputTextField, InputFloatField } from '../components/inputs';
import Modal from '../components/modal';
import Consulta from '../crud/consulta';
import ConsultaArticulo from '../crud/consultaArticulo';
import * as databaseRead from '../database/getData';
import {postObjectToAPI} from '../database/writeData';
import dialogs from '../utilities/dialogs';
import ItemArticulo from '../components/ItemArticulo';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/SendTwoTone';
import SearchIcon from '@material-ui/icons/Search';

const numeroFormWidth = {width: '5rem'};
const codigoFormWidth = {width: '15rem'};
const observacionesFormWidth = {width: '40vw'};

const requestLastNumeroSeña = () => (dispatch) => {
  dispatch({type: 'REQUEST_LAST_SEÑA_PENDING'});
  databaseRead.getLastNumeroSeña()
    .then(lastId => dispatch({type: 'REQUEST_LAST_SEÑA_SUCCESS', payload: lastId}))
    .catch(error => dispatch({type: 'REQUEST_LAST_SEÑA_FAILED', payload: error}));
};

const mapStateToProps = state => ({
  cliente: state.seña.cliente,
  observaciones: state.seña.observaciones,
  numeroSeña: state.seña.numeroSeña,
  items: state.seña.items,
  monto: state.seña.monto,
  isPending: state.seña.isPending,
  error: state.seña.error,
  clienteDefault: state.defaults.clienteDefault,
  vendedor: state.session.vendedor,
  turno: state.session.turno
});

const mapDispatchToProps = dispatch => ({
  addOne: (codigo) => dispatch({type: 'retiro_addOneQuantityItem', payload: codigo}),
  addItem: (articulo) => dispatch({type: 'retiro_addItem', payload: articulo}),
  addPago: (pago) => dispatch({type: 'retiro_addPago', payload: pago}),
  vaciar: () => dispatch({type: 'retiro_vaciar'}),
  setCliente: (cliente) => dispatch({type: 'retiro_setCliente', payload: cliente}),
  setObservaciones: (observaciones) => dispatch({type: 'retiro_setObservaciones', payload: observaciones}),
  setMonto: (monto) => dispatch({type: 'seña_setMonto', payload: monto}),
  nuevo: (obj) => dispatch({type: 'retiro_nueva', payload: obj}),
  onRequestLastSeña: () => dispatch(requestLastNumeroSeña()),
  setCantidadIndividual: (articulo) => event => dispatch({type: 'retiro_setCantidadIndividual', payload: {articulo, value: event.target.value}}),
  removeItem: (articulo) => () => dispatch({type: 'retiro_removeItem', payload: articulo}),
  updateCantidadArticulo: (id, cantidad, suma) => dispatch({type: 'UPDATE_ARTICULO_CANTIDAD', payload: {id, cantidad, suma}})
});

function Seña ({
  cliente, observaciones, numeroSeña, items, isPending, error, clienteDefault, vendedor, turno,
  monto, setMonto, addOne, addItem, addPago, vaciar, setCliente, setObservaciones, nuevo,
  onRequestLastSeña, setCantidadIndividual, removeItem, updateCantidadArticulo
}) {
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const getNuevaSeña = async () => {
    onRequestLastSeña();
    vaciar();
    nuevo({
      cliente: clienteDefault,
      turno,
      vendedor
    });
  };

  useEffect(() => {
    if (numeroSeña === 0) {
      getNuevaSeña();
    }
  }, []);

  const handleCodigoSearch = (event) => {
    if (!event) return false;
    if (event.which !== 13) return false;
    if (event.target.value === '') return false;
    handleAddItem(event.target.value);
    event.target.value = '';
  };

  const handleAddItem = (data) => {
    const cod = typeof data === 'string' ? data : data.CODIGO;
    const articulo = items.find(item => item.CODIGO === cod);
    if (articulo) {
      addOne(cod);
      dialogs.success('AGREGADO!!!  +1');
      var aud = new window.Audio(audioOk);
      aud.play();
    } else { // add new articulo
      databaseRead.getArticuloByCodigo(cod)
        .then(res => {
          if (res.length === 0) {
            dialogs.error('CODIGO NO EXISTENTE');
            var aud2 = new window.Audio(audioError);
            aud2.play();
          } else {
            addItem(res);
            dialogs.success('AGREGADO!!!');
            var aud = new window.Audio(audioOk);
            aud.play();
          }
        });
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (items.length === 0) {
      dialogs.error('Seña vacia; no agregada');
    } else {
      // TODO: VALIDATIONS
      dialogs.confirm(
        confirmed => confirmed && postToAPI(), // Callback
        'Confirmar seña?', // Message text
        'CONFIRMAR', // Confirm text
        'VOLVER' // Cancel text
      );
    }
  };

  const postToAPI = async () => {
    try {
      const señaId = await postObjectToAPI({
        NUMERO_SEÑA: numeroSeña,
        MONTO: monto,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        ESTADO_ID: 2,
        OBSERVACIONES: observaciones,
        CLIENTE_ID: cliente.id,
        TURNO_ID: turno.id
      }, 'seña').then(json => json.lastId);

      items.forEach(item => {
        // updating local state, same thing happens in the backend
        updateCantidadArticulo(item.id, item.CANTIDAD, false);
        postObjectToAPI({
          SEÑA_ID: señaId,
          CANTIDAD: item.CANTIDAD,
          ARTICULO_ID: item.id,
          PRECIO_UNITARIO: item.PRECIO_UNITARIO
        }, 'itemSeña');
      });

      dialogs.success(`SEÑA ${numeroSeña} REALIZADA!!!`);
      getNuevaSeña();
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
    // TODO: BUSSSINESS LOGIC: PONER EN PLATA INGRESADA EN CAJA DEL DIA O NO ???
  };

  const handleVaciar = (event) => {
    dialogs.confirm(
      confirmed => confirmed && vaciar(), // Callback
      'VACIAR VENTA?', // Message text
      'SI', // Confirm text
      'NO' // Cancel text
    );
  };

  const articuloModal = () => {
    setModalContent(
      <ConsultaArticulo
        handleSelection={addItem}
        setDisplayModal={setDisplayModal} />
    );
    setDisplayModal(true);
  };

  const clienteModal = () => {
    setModalContent(
      <Consulta
        table='cliente'
        columnsWidths={[40, 400, 120, 120, 120]}
        setDisplayModal={setDisplayModal}
        handleSelection={setCliente} />
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
      <div className='panel'>
        <InputTextField style={numeroFormWidth} name='Seña' value={numeroSeña} readOnly />
        <InputTextField name='Cliente' value={cliente.NOMBRE} readOnly onClick={clienteModal} />
      </div>
      <div className='panel'>
        <UncontrolledInput style={codigoFormWidth} name='Codigo' autoFocus autoComplete='off' onKeyPress={handleCodigoSearch} />
        <Button variant='outlined' color='primary' onClick={articuloModal} >
          Buscar Articulo &nbsp;
          <SearchIcon />
        </Button>
      </div>
      <div className='panel'>
        <InputTextField style={observacionesFormWidth} name='Observaciones' value={observaciones} setValue={setObservaciones} />
      </div>
      <table id='table'>
        <thead>
          <tr>
            <th className='table-header-cantidad'>Cant</th>
            <th className='table-header-codigo'>Codigo</th>
            <th className='table-header-descripcion'>Descripcion</th>
            <th className='table-header-stock'>Stock</th>
            <th className='table-header-precio-lista'>Precio Lista</th>
            <th className='table-header-precio-total'>Precio Total</th>
          </tr>
        </thead>
        <tbody id='tbody'>
          {items.map(item => <ItemArticulo
            key={item.id}
            setCantidadIndividual={setCantidadIndividual(item)}
            removeItem={removeItem(item)}
            articulo={item} />)}
        </tbody>
      </table>
      <div className='panel'>
        <InputTextField readOnly name='Vendedor' value={vendedor.NOMBRE} />
        <InputTextField readOnly name='Turno' value={turno.id} />
        <InputTextField readOnly name='Fecha' value={dateFormat(new Date(), 'MM/dd/yyyy')} />
      </div>
      <div className='panel'>
        <InputFloatField name='Monto' value={monto} setValue={setMonto} autoComplete='off' />
      </div>
      <div className='panel'>
        <Button variant='outlined' color='secondary' onClick={handleVaciar}>
          Vaciar &nbsp;
          <DeleteIcon />
        </Button>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Realizar Seña &nbsp;
          <SendIcon />
        </Button>
      </div>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Seña);
