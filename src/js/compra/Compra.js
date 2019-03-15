import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState, useContext } from 'react';
import CrudArticulo from '../crud/crudArticulo';

import Consulta from '../crud/consulta';
import ItemArticulo from '../components/ItemArticulo';
import dialogs from '../utilities/dialogs';
import * as databaseRead from '../database/getData';
import {postObjectToAPI} from '../database/writeData';
import ConsultaArticulo from '../crud/consultaArticulo';
import { InputTextField } from '../components/inputs';
import audioOk from '../../resources/audio/ok.wav';
import Modal from '../components/modal';
import { MainContext } from '../context/MainContext';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/SendTwoTone';
import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';

export default function Compra (props) {
  const {compraState: state, compraDispatch: dispatch} = useContext(MainContext);
  const {updateCantidadArticulo, proveedorDefault, vendedor, turno} = useContext(MainContext);
  const [codigo, setCodigo] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const getNuevaCompra = async () => {
    const lastNumeroCompra = await databaseRead.getLastNumeroCompra();
    dispatch({
      type: 'nuevaCompra',
      payload: {
        numeroCompra: lastNumeroCompra.lastId + 1,
        proveedor: proveedorDefault,
        items: [],
        vendedor,
        turno,
        observaciones: ''
      }
    });
  };

  useEffect(() => {
    if (state.numeroCompra === 0) {
      getNuevaCompra();
    }
  }, []);

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
          if (!res || res.length === 0) {
            dialogs.confirm(
              confirmed => confirmed && crudArticuloModal(), // Callback
              'ARTICULO NO EXISTENTE AGREGAR NUEVO?', // Message text
              'SI', // Confirm text
              'NO' // Cancel text
            );
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

  const vaciar = (event) => {
    const vaciarAction = {type: 'nuevaCompra', payload: {observaciones: '', items: []}};
    dialogs.confirm(
      confirmed => confirmed && dispatch(vaciarAction), // Callback
      'VACIAR COMPRA?', // Message text
      'SI', // Confirm text
      'NO' // Cancel text
    );
  };

  const addItemHandler = (event) => {
    if (!codigo) return false;
    if (event.which !== 13) return false;
    addItem();
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (state.items.length === 0) {
      dialogs.error('Factura vacia; no agregada');
    } else {
      // TODO: VALIDATIONS
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
      const facturaId = await postObjectToAPI({
        NUMERO_COMPRA: state.numeroCompra,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        OBSERVACIONES: state.observaciones,
        PROVEEDOR_ID: state.proveedor.id,
        TURNO_ID: turno.id
      }, 'compra').then(json => json.lastId);

      state.items.forEach(item => {
        // updating local state, same thing happens in the backend
        updateCantidadArticulo(item.id, item.CANTIDAD, true);
        postObjectToAPI({
          COMPRA_ID: facturaId,
          CANTIDAD: item.CANTIDAD,
          ARTICULO_ID: item.id
        }, 'itemCompra');
      });

      dialogs.success(`COMPRA ${state.numeroCompra} REALIZADA!!!`);
      getNuevaCompra();
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
  }; // TODO: post factura

  const articuloModal = () => {
    setModalContent(
      <ConsultaArticulo
        handleSelection={addItem}
        setDisplayModal={setDisplayModal} />
    );
    setDisplayModal(true);
  };

  const crudArticuloModal = () => {
    setModalContent(
      <CrudArticulo
        initialState={{codigo}}
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
        handleSelection={obj => dispatch({type: 'setProveedor', payload: obj})} />
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
        <InputTextField name='Compra' value={state.numeroCompra} readOnly />
        <InputTextField name='Proveedor' value={state.proveedor.NOMBRE} readOnly onClick={proveedorModal} />
      </div>
      <div className='panel'>
        <InputTextField name='Codigo' value={codigo} autoFocus autoComplete='off' onKeyPress={addItemHandler} setValue={setCodigo} />
        <Button variant='outlined' color='primary' onClick={articuloModal} >
          Buscar Articulo &nbsp;
          <SearchIcon />
        </Button>
        <Button variant='outlined' color='primary' onClick={crudArticuloModal} >
          Agregar Articulo &nbsp;
          <CreateIcon />
        </Button>
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
            <th className='table-header-stock'>Stock Anterior</th>
            <th className='table-header-stock'>Stock Nuevo</th>
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
        <Button variant='outlined' color='secondary' onClick={vaciar}>
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
