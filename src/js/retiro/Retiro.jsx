import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState, useContext, useReducer } from 'react';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import { InputTextField } from '../components/inputs';
import Modal from '../components/modal';
import ConsultaArticulo from '../crud/consultaArticulo';
import * as databaseRead from '../database/getData';
import {postObjectToAPI} from '../database/writeData';
import dialogs from '../utilities/dialogs';
import { MainContext } from '../context/MainContext';
import { retiroReducer } from './RetiroReducer';
import ItemArticulo from '../components/ItemArticulo';

export default function Retiro (props) {
  const {updateCantidadArticulo, vendedor, turno} = useContext(MainContext);
  const [state, dispatch] = useReducer(
    retiroReducer,
    { observaciones: '',
      numeroRetiro: 0,
      vendedor,
      turno,
      items: []});
  const [codigo, setCodigo] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const getNuevoRetiro = async () => {
    const lastNumeroRetiro = await databaseRead.getLastNumeroRetiro();
    dispatch({
      type: 'nuevo',
      payload: {
        numeroRetiro: lastNumeroRetiro.lastId + 1,
        items: [],
        turno,
        vendedor,
        observaciones: ''
      }
    });
  };

  useEffect(() => {
    if (state.numeroRetiro === 0) {
      getNuevoRetiro();
    }
  }, []);

  const addItemHandler = (event) => {
    if (!codigo) return false;
    if (event.which !== 13) return false;
    addItem();
  };

  // full data needed:
  // data, codigo, state.items, dispatch, setCodigo
  const addItem = (data) => {
    const cod = data ? data.CODIGO : codigo;
    const articulo = state.items.find(item => item.CODIGO === cod);
    if (articulo) {
      dispatch({type: 'addOneQuantityItem', payload: cod});
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
            dispatch({type: 'addItem', payload: res});
            dialogs.success('AGREGADO!!!');
            var aud = new window.Audio(audioOk);
            aud.play();
          }
        });
    }
    setCodigo('');
  };

  const postToAPI = async () => {
    try {
      const retiroId = await postObjectToAPI({
        NUMERO_RETIRO: state.numeroRetiro,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        OBSERVACIONES: state.observaciones,
        TURNO_ID: turno.id
      }, 'retiro').then(json => json.lastId);

      state.items.forEach(item => {
        // updating local state, same thing happens in the backend
        updateCantidadArticulo(item.id, item.CANTIDAD, false);
        postObjectToAPI({
          RETIRO_ID: retiroId,
          CANTIDAD: item.CANTIDAD,
          ARTICULO_ID: item.id
        }, 'itemRetiro');
      });

      dialogs.success(`RETIRO ${state.numeroRetiro} REALIZADO!!!`);
      getNuevoRetiro();
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (state.items.length === 0) {
      dialogs.error('Retiro vacio; no agregada');
    } else {
      // TODO: VALIDATIONS
      dialogs.confirm(
        confirmed => confirmed && postToAPI(), // Callback
        'Confirmar retiro?', // Message text
        'CONFIRMAR', // Confirm text
        'VOLVER' // Cancel text
      );
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

  const vaciar = (event) => {
    const vaciarAction = {type: 'nuevo', payload: {observaciones: '', items: []}};
    dialogs.confirm(
      confirmed => confirmed && dispatch(vaciarAction), // Callback
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
      <div className='panel'>
        <InputTextField name='Retiro' value={state.numeroRetiro} readOnly />
      </div>
      <div className='panel'>
        <InputTextField name='Codigo' value={codigo} autoFocus autoComplete='off' onKeyPress={addItemHandler} setValue={setCodigo} />
        <button className='codigo-search' onClick={articuloModal}>BUSCAR ARTICULO</button>
      </div>
      <div className='panel'>
        <InputTextField name='Observaciones' value={state.observaciones} setValue={payload => dispatch({type: 'setObservaciones', payload})} />
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
          {state.items.map(item => <ItemArticulo
            key={item.id}
            dispatch={dispatch}
            articulo={item} />)}
        </tbody>
      </table>
      <div className='panel'>
        <InputTextField readOnly name='Vendedor' value={state.vendedor.NOMBRE} />
        <InputTextField readOnly name='Turno' value={state.turno.id} />
        <InputTextField readOnly name='Fecha' value={dateFormat(new Date(), 'MM/dd/yyyy')} />
      </div>
      <div className='panel'>
        <button className='codigo-search' onClick={handleSubmit}>AGREGAR RETIRO</button>
      </div>
      <div className='panel'>
        <button className='codigo-search' onClick={vaciar}>VACIAR SEÑA</button>
      </div>
    </React.Fragment>
  );
}
