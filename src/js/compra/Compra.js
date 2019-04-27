import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import CrudArticulo from '../crud/crudArticulo';

import Consulta from '../crud/consulta';
import ItemArticulo from '../components/ItemArticulo';
import dialogs from '../utilities/dialogs';
import {getLastNumeroCompra, getArticuloByCodigo} from '../database/getData';
import {postObjectToAPI} from '../database/writeData';
import ConsultaArticulo from '../crud/consultaArticulo';
import { InputTextField, UncontrolledInput } from '../components/inputs';
import audioOk from '../../resources/audio/ok.wav';
import Modal from '../components/modal';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/SendTwoTone';
import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';

const numeroFormWidth = {width: '5rem'};
const codigoFormWidth = {width: '15rem'};
const observacionesFormWidth = {width: '40vw'};

const requestLastNumeroCompra = () => (dispatch) => {
  dispatch({type: 'REQUEST_LAST_COMPRA_PENDING'});
  getLastNumeroCompra()
    .then(lastId => dispatch({type: 'REQUEST_LAST_COMPRA_SUCCESS', payload: lastId}))
    .catch(error => dispatch({type: 'REQUEST_LAST_COMPRA_FAILED', payload: error}));
};

const mapStateToProps = state => ({
  proveedor: state.compra.proveedor,
  observaciones: state.compra.observaciones,
  numeroCompra: state.compra.numeroCompra,
  isPending: state.compra.isPending,
  items: state.compra.items,
  proveedorDefault: state.defaults.proveedorDefault,
  vendedor: state.session.vendedor,
  turno: state.caja.turnos[state.caja.turnos.length - 1]
});

const mapDispatchToProps = dispatch => ({
  addOne: (codigo) => dispatch({type: 'compra_addOneQuantityItem', payload: codigo}),
  addItem: (articulo) => dispatch({type: 'compra_addItem', payload: articulo}),
  vaciar: () => dispatch({type: 'compra_vaciar'}),
  setProveedor: (proveedor) => dispatch({type: 'compra_setProveedor', payload: proveedor}),
  setTipoPago: (tipoPago) => dispatch({type: 'compra_setTipoPago', payload: tipoPago}),
  setObservaciones: (observaciones) => dispatch({type: 'compra_setObservaciones', payload: observaciones}),
  nuevo: (obj) => dispatch({type: 'compra_nueva', payload: obj}),
  onRequestLastCompra: () => dispatch(requestLastNumeroCompra()),
  setCantidadIndividual: (articulo) => event => dispatch({type: 'compra_setCantidadIndividual', payload: {articulo, value: event.target.value}}),
  removeItem: (articulo) => () => dispatch({type: 'compra_removeItem', payload: articulo}),
  updateCantidadArticulo: (id, cantidad, suma) => dispatch({type: 'UPDATE_ARTICULO_CANTIDAD', payload: {id, cantidad, suma}})
});

function Compra ({
  proveedor, vendedor, turno, observaciones, numeroCompra, isPending, items,
  addOne, addItem, vaciar, removeItem, setCantidadIndividual,
  setProveedor, setTipoPago, setObservaciones, nuevo, proveedorDefault,
  onRequestLastCompra, updateCantidadArticulo
}) {
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const getNuevaCompra = async () => {
    onRequestLastCompra();
    if (items.length > 0 || observaciones !== '') {
      vaciar();
    }
    nuevo({
      proveedor: proveedorDefault,
      vendedor,
      turno
    });
  };

  useEffect(() => {
    if (numeroCompra === 0) {
      getNuevaCompra();
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
    const cod = typeof data === 'string' ? data : data.codigo;
    const articulo = items.find(item => item.codigo === cod);
    if (articulo) {
      addOne(cod);
      dialogs.success('AGREGADO!!!  +1');
      var aud = new window.Audio(audioOk);
      aud.play();
    } else { // add new articulo
      getArticuloByCodigo(cod)
        .then(res => {
          if (!res || res.length === 0) {
            dialogs.confirm(
              confirmed => confirmed && crudArticuloModal(cod), // Callback
              'ARTICULO NO EXISTENTE AGREGAR NUEVO?', // Message text
              'SI', // Confirm text
              'NO' // Cancel text
            );
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
      dialogs.error('Compra vacia; no agregada');
      // the inputs don't allow incorrect data
    } else {
      dialogs.confirm(
        confirmed => confirmed && postToAPI(), // Callback
        'Confirmar compra?', // Message text
        'CONFIRMAR', // Confirm text
        'VOLVER' // Cancel text
      );
    }
  };

  const postToAPI = async () => {
    try {
      const compraId = await postObjectToAPI({
        numeroCompra,
        fechaHora: new Date().getTime(), // UNIX EPOCH TIME
        observaciones,
        proveedorId: proveedor.id,
        turnoId: turno.id
      }, 'compra').then(json => json.lastId);

      items.forEach(item => {
        // updating local state, same thing happens in the backend
        updateCantidadArticulo(item.id, item.cantidad, true);
        postObjectToAPI({
          compraId,
          cantidad: item.cantidad,
          articuloId: item.id
        }, 'itemCompra');
      });

      dialogs.success(`COMPRA ${numeroCompra} REALIZADA!!!`);
      getNuevaCompra();
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
  };

  const handleVaciar = (event) => {
    dialogs.confirm(
      confirmed => confirmed && vaciar(), // Callback
      'VACIAR VENTA?', // Message text
      'SI', // Confirm text
      'NO' // Cancel text
    );
  };

  const handleAgregarClick = () => {
    crudArticuloModal(document.querySelector('#codigo-search').value);
  };

  const articuloModal = () => {
    setModalContent(
      <ConsultaArticulo
        handleSelection={addItem}
        setDisplayModal={setDisplayModal} />
    );
    setDisplayModal(true);
  };

  const crudArticuloModal = (codigo) => {
    setModalContent(
      <CrudArticulo
        initialRequest={{codigo}}
        handleSelection={addItem}
        setDisplayModal={setDisplayModal} />
    );
    setDisplayModal(true);
  };

  const proveedorModal = () => {
    setModalContent(
      <Consulta
        table='proveedor'
        columnsWidths={[40, 400, 120, 120, 120]}
        setDisplayModal={setDisplayModal}
        handleSelection={setProveedor} />
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
        <InputTextField style={numeroFormWidth} name='Compra' value={numeroCompra} readOnly />
        <InputTextField name='Proveedor' value={proveedor.nombre} readOnly onClick={proveedorModal} />
      </div>
      <div className='panel'>
        <UncontrolledInput id='codigo-search' style={codigoFormWidth} name='Codigo' autoFocus autoComplete='off' onKeyPress={handleCodigoSearch} />
        <Button variant='outlined' color='primary' onClick={articuloModal} >
          Buscar Articulo &nbsp;
          <SearchIcon />
        </Button>
        <Button variant='outlined' color='primary' onClick={handleAgregarClick} >
          Agregar Articulo &nbsp;
          <CreateIcon />
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
            <th className='table-header-stock'>Stock Anterior</th>
            <th className='table-header-stock'>Stock Nuevo</th>
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
        <InputTextField readOnly name='Vendedor' value={vendedor.nombre} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Compra);
