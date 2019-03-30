import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import { InputTextField, UncontrolledInput } from '../components/inputs';
import Modal from '../components/modal';
import ConsultaArticulo from '../crud/consultaArticulo';
import {getLastNumeroRetiro, getArticuloByCodigo} from '../database/getData';
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

const requestLastNumeroRetiro = () => (dispatch) => {
  dispatch({type: 'REQUEST_LAST_RETIRO_PENDING'});
  getLastNumeroRetiro()
    .then(lastId => dispatch({type: 'REQUEST_LAST_RETIRO_SUCCESS', payload: lastId}))
    .catch(error => dispatch({type: 'REQUEST_LAST_RETIRO_FAILED', payload: error}));
};

const mapStateToProps = state => ({
  observaciones: state.retiro.observaciones,
  numeroRetiro: state.retiro.numeroRetiro,
  items: state.retiro.items,
  isPending: state.retiro.isPending,
  error: state.retiro.error,
  vendedor: state.session.vendedor,
  turno: state.caja.turnos[state.caja.turnos.length - 1]
});

const mapDispatchToProps = dispatch => ({
  addOne: (codigo) => dispatch({type: 'retiro_addOneQuantityItem', payload: codigo}),
  addItem: (articulo) => dispatch({type: 'retiro_addItem', payload: articulo}),
  vaciar: () => dispatch({type: 'retiro_vaciar'}),
  setObservaciones: (observaciones) => dispatch({type: 'retiro_setObservaciones', payload: observaciones}),
  nuevo: (obj) => dispatch({type: 'retiro_nuevo', payload: obj}),
  onRequestLastRetiro: () => dispatch(requestLastNumeroRetiro()),
  setCantidadIndividual: (articulo) => event => dispatch({type: 'retiro_setCantidadIndividual', payload: {articulo, value: event.target.value}}),
  removeItem: (articulo) => () => dispatch({type: 'retiro_removeItem', payload: articulo}),
  updateCantidadArticulo: (id, cantidad, suma) => dispatch({type: 'UPDATE_ARTICULO_CANTIDAD', payload: {id, cantidad, suma}})
});

function Retiro ({
  observaciones, numeroRetiro, items, isPending, error, vendedor, turno,
  addOne, addItem, vaciar, setObservaciones, nuevo,
  onRequestLastRetiro, setCantidadIndividual, removeItem, updateCantidadArticulo
}) {
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const getNuevoRetiro = async () => {
    onRequestLastRetiro();
    vaciar();
    nuevo({
      vendedor,
      turno
    });
  };

  useEffect(() => {
    if (numeroRetiro === 0) {
      getNuevoRetiro();
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
      getArticuloByCodigo(cod)
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
      dialogs.error('Retiro vacio; no agregado');
    } else {
      dialogs.confirm(
        confirmed => confirmed && postToAPI(), // Callback
        'Confirmar retiro?', // Message text
        'CONFIRMAR', // Confirm text
        'VOLVER' // Cancel text
      );
    }
  };

  const postToAPI = async () => {
    try {
      const retiroId = await postObjectToAPI({
        NUMERO_RETIRO: numeroRetiro,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        OBSERVACIONES: observaciones,
        TURNO_ID: turno.id
      }, 'retiro').then(json => json.lastId);

      items.forEach(item => {
        // updating local state, same thing happens in the backend
        updateCantidadArticulo(item.id, item.CANTIDAD, false);
        postObjectToAPI({
          RETIRO_ID: retiroId,
          CANTIDAD: item.CANTIDAD,
          ARTICULO_ID: item.id
        }, 'itemRetiro');
      });

      dialogs.success(`RETIRO ${numeroRetiro} REALIZADO!!!`);
      getNuevoRetiro();
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
  };

  const articuloModal = () => {
    setModalContent(
      <ConsultaArticulo
        handleSelection={addItem}
        setDisplayModal={setDisplayModal} />
    );
    setDisplayModal(true);
  };

  const handleVaciar = (event) => {
    dialogs.confirm(
      confirmed => confirmed && vaciar(), // Callback
      'VACIAR RETIRO?', // Message text
      'SI', // Confirm text
      'NO' // Cancel text
    );
  };

  return (
    <React.Fragment>
      {
        displayModal && <Modal displayModal={displayModal} setDisplayModal={setDisplayModal}>
          {modalContent}
        </Modal>
      }
      <InputTextField style={numeroFormWidth} name='Retiro' value={numeroRetiro} readOnly />
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
            <th className='table-header-stock'>Stock Nuevo</th>
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
        <Button variant='outlined' color='secondary' onClick={handleVaciar}>
          Vaciar &nbsp;
          <DeleteIcon />
        </Button>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Realizar Compra &nbsp;
          <SendIcon />
        </Button>
      </div>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Retiro);
