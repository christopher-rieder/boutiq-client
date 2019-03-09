import React, { useEffect, useState, useContext, useReducer } from 'react';
import CompraReducer from './CompraReducer';
import CrudArticulo from '../articulo/crudArticulo';

import Consulta from '../crud/consulta';
import ItemCompra from './ItemCompra';
import dialogs from '../utilities/dialogs';
import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import ConsultaArticulo from '../crud/consultaArticulo';
import { InputTextField } from '../components/inputs';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import Modal from '../components/modal';
import { ConfigContext } from '../context/ConfigContext';

export default function Compra (props) {
  const [compra, dispatchCompra] = useReducer(CompraReducer.reducer, CompraReducer.initialState);
  const [codigo, setCodigo] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const getNuevaCompra = async () => {
    const lastNumeroCompra = await databaseRead.getLastNumeroCompra();
    const proveedor = await databaseRead.getItemById('proveedor', 1);
    dispatchCompra({
      type: 'nuevaCompra',
      payload: {
        numeroCompra: lastNumeroCompra.lastId + 1,
        proveedor,
        items: [],
        observaciones: ''
      }
    });
  };

  useEffect(() => {
    getNuevaCompra();
  }, []);

  const addCompraItem = (data) => {
    const cod = data ? data.CODIGO : codigo;
    const articulo = compra.items.find(item => item.CODIGO === cod);
    if (articulo) {
      dispatchCompra({type: 'addOneQuantityItem', payload: cod});
      dialogs.success('AGREGADO!!!  +1');
      var aud = new window.Audio(audioOk);
      aud.play();
    } else { // add new articulo
      databaseRead.getArticuloByCodigo(cod)
        .then(res => {
          if (res.length === 0) {
            dialogs.confirm(
              confirmed => confirmed && crudArticuloModal(), // Callback
              'ARTICULO NO EXISTENTE AGREGAR NUEVO?', // Message text
              'SI', // Confirm text
              'NO' // Cancel text
            );
          } else {
            dispatchCompra({type: 'addItem', payload: res});
            dialogs.success('AGREGADO!!!');
            var aud = new window.Audio(audioOk);
            aud.play();
          }
        });
    }
    setCodigo('');
  };

  const addCompraHandler = (event) => {
    if (!codigo) return false;
    if (event.which !== 13) return false;
    addCompraItem();
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (compra.items.length === 0) {
      dialogs.error('Factura vacia; no agregada');
    } else {
      // TODO: VALIDATIONS
      dialogs.confirm(
        confirmed => confirmed && postCompraToAPI(), // Callback
        'Confirmar compra?', // Message text
        'CONFIRMAR', // Confirm text
        'VOLVER' // Cancel text
      );
    }
  };

  const postCompraToAPI = async () => {
    try {
      const facturaId = await databaseWrite.postCompra({
        NUMERO_COMPRA: compra.numeroCompra,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        OBSERVACIONES: compra.observaciones,
        PROVEEDOR_ID: compra.proveedor.id
      });

      compra.items.forEach(item => {
        databaseWrite.postItemCompra({
          COMPRA_ID: facturaId,
          CANTIDAD: item.CANTIDAD,
          ARTICULO_ID: item.id
        });
      });

      dialogs.success(`COMPRA ${compra.numeroCompra} REALIZADA!!!`);
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
    props.updateArticuloData();
    getNuevaCompra();
  }; // TODO: post factura

  const articuloModal = () => {
    setModalContent(
      <ConsultaArticulo
        articuloData={props.articuloData}
        handleSelection={addCompraItem}
        setDisplayModal={setDisplayModal} />
    );
    setDisplayModal(true);
  };

  const crudArticuloModal = () => {
    setModalContent(
      <CrudArticulo
        codigo={codigo}
        handleSelection={addCompraItem}
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
        handleSelection={obj => dispatchCompra({type: 'setProveedor', payload: obj})} />
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
        <InputTextField name='Factura' value={compra.numeroCompra} readOnly />
        <InputTextField name='Cliente' value={compra.proveedor.NOMBRE} readOnly onClick={proveedorModal} />
      </div>
      <div className='panel'>
        <InputTextField name='Codigo' value={codigo} autoFocus autoComplete='off' onKeyPress={addCompraHandler} onChange={event => setCodigo(event.target.value)} />
        <button className='codigo-search' onClick={articuloModal}>BUSCAR ARTICULO</button>
        <button className='codigo-search' onClick={crudArticuloModal}>AGREGAR ARTICULO NUEVO</button>
      </div>
      <div className='panel'>
        <InputTextField name='Observaciones' value={compra.observaciones} onChange={event => dispatchCompra({type: 'setObservaciones', payload: event.target.value})} />
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
          {compra.items.map(item => <ItemCompra
            key={item.id}
            dispatchCompra={dispatchCompra}
            articulo={item} />)}
        </tbody>
      </table>
      <div className='panel'>
        <button className='codigo-search' onClick={handleSubmit}>AGREGAR COMPRA</button>
      </div>
    </React.Fragment>
  );
}
