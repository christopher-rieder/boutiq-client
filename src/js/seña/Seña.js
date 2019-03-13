import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState, useContext, useReducer } from 'react';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import { InputTextField, InputFloatField } from '../components/inputs';
import Modal from '../components/modal';
import Consulta from '../crud/consulta';
import ConsultaArticulo from '../crud/consultaArticulo';
import * as databaseRead from '../database/getData';
import {postObjectToAPI} from '../database/writeData';
import dialogs from '../utilities/dialogs';
import { MainContext } from '../context/MainContext';
import { señaReducer } from './SeñaReducer';
import ItemArticulo from '../components/ItemArticulo';

export default function Seña (props) {
  const {tablaEstadoPago, consumidorFinal, updateCantidadArticulo, vendedor, turno} = useContext(MainContext);
  const [state, dispatch] = useReducer(
    señaReducer,
    { cliente: consumidorFinal,
      observaciones: '',
      numeroSeña: 0,
      vendedor,
      turno,
      monto: 0,
      estado: tablaEstadoPago[1], // PENDIENTE
      items: []});
  const [codigo, setCodigo] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const getNuevaSeña = async () => {
    const lastNumeroSeña = await databaseRead.getLastNumeroSeña();
    dispatch({
      type: 'nuevo',
      payload: {
        numeroSeña: lastNumeroSeña.lastId + 1,
        cliente: consumidorFinal,
        items: [],
        monto: 0,
        turno,
        vendedor,
        observaciones: ''
      }
    });
  };

  useEffect(() => {
    if (state.numeroSeña === 0) {
      getNuevaSeña();
    }
  }, []);

  const addItemHandler = (event) => {
    if (!codigo) return false;
    if (event.which !== 13) return false;
    addItem();
  };

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
      const señaId = await postObjectToAPI({
        NUMERO_SEÑA: state.numeroSeña,
        MONTO: state.monto,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        ESTADO_ID: 2,
        OBSERVACIONES: state.observaciones,
        CLIENTE_ID: state.cliente.id,
        TURNO_ID: turno.id
      }, 'seña').then(json => json.lastId);

      state.items.forEach(item => {
        // updating local state, same thing happens in the backend
        updateCantidadArticulo(item.id, item.CANTIDAD, false);
        postObjectToAPI({
          SEÑA_ID: señaId,
          CANTIDAD: item.CANTIDAD,
          ARTICULO_ID: item.id,
          PRECIO_UNITARIO: item.PRECIO_UNITARIO
        }, 'itemSeña');
      });

      dialogs.success(`SEÑA ${state.numeroSeña} REALIZADA!!!`);
      getNuevaSeña();
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
    // TODO: BUSSSINESS LOGIC: PONER EN PLATA INGRESADA EN CAJA DEL DIA O NO ???
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (state.items.length === 0) {
      dialogs.error('Factura vacia; no agregada');
    } else {
      // TODO: VALIDATIONS
      dialogs.confirm(
        confirmed => confirmed && postToAPI(), // Callback
        'Confirmar venta?', // Message text
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

  const clienteModal = () => {
    setModalContent(
      <Consulta
        table='cliente'
        columnsWidths={[40, 400, 120, 120, 120]}
        setDisplayModal={setDisplayModal}
        handleSelection={obj => dispatch({type: 'setCliente', payload: obj})} />
    );
    setDisplayModal(true);
  };

  const vaciar = (event) => {
    const vaciarAction = {type: 'nuevo', payload: {observaciones: '', items: [], pagos: [], descuento: 0}};
    dialogs.confirm(
      confirmed => confirmed && dispatch(vaciarAction), // Callback
      'VACIAR SEÑA?', // Message text
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
        <InputTextField name='Seña' value={state.numeroSeña} readOnly />
        <InputTextField name='Cliente' value={state.cliente.NOMBRE} readOnly onClick={clienteModal} />
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
        <InputFloatField name='Monto' value={state.monto} setValue={monto => dispatch({type: 'setMonto', payload: monto})} autoComplete='off' />
        <button className='codigo-search' onClick={handleSubmit}>AGREGAR SEÑA</button>
      </div>
      <div className='panel'>
        <button className='codigo-search' onClick={vaciar}>VACIAR SEÑA</button>
      </div>
    </React.Fragment>
  );
}
