import React, { useEffect, useState, useContext } from 'react';
import CrudArticulo from '../crud/crudArticulo';

import Consulta from '../crud/consulta';
import ItemArticulo from '../components/ItemArticulo';
import dialogs from '../utilities/dialogs';
import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import ConsultaArticulo from '../crud/consultaArticulo';
import { InputTextField } from '../components/inputs';
import audioOk from '../../resources/audio/ok.wav';
import Modal from '../components/modal';
import { MainContext } from '../context/MainContext';

export default function Compra (props) {
  const {compraState: state, compraDispatch: dispatch} = useContext(MainContext);
  const {articuloData, setArticuloData, proveedorDefault} = useContext(MainContext);
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
      const facturaId = await databaseWrite.postCompra({
        NUMERO_COMPRA: state.numeroCompra,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        OBSERVACIONES: state.observaciones,
        PROVEEDOR_ID: state.proveedor.id
      });

      state.items.forEach(item => {
        databaseWrite.postItemCompra({
          COMPRA_ID: facturaId,
          CANTIDAD: item.CANTIDAD,
          ARTICULO_ID: item.id
        });
      });

      dialogs.success(`COMPRA ${state.numeroCompra} REALIZADA!!!`);
      setTimeout(() => setArticuloData([]), 1000); // FIXME: HACKY
      // TODO: UPDATE
      getNuevaCompra();
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
  }; // TODO: post factura

  const articuloModal = () => {
    setModalContent(
      <ConsultaArticulo
        articuloData={articuloData}
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
        <button className='codigo-search' onClick={articuloModal}>BUSCAR ARTICULO</button>
        <button className='codigo-search' onClick={crudArticuloModal}>AGREGAR ARTICULO NUEVO</button>
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
        <button className='codigo-search' onClick={handleSubmit}>AGREGAR COMPRA</button>
      </div>
      <div className='panel'>
        <button className='codigo-search' onClick={vaciar}>VACIAR COMPRA</button>
      </div>
    </React.Fragment>
  );
}
