import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState, useContext } from 'react';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import { InputTextField, InputSelect, InputFloatField } from '../components/inputs';
import Modal from '../components/modal';
import Consulta from '../crud/consulta';
import ConsultaArticulo from '../crud/consultaArticulo';
import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import dialogs from '../utilities/dialogs';
import { money } from '../utilities/format';
import ItemArticulo from '../components/ItemArticulo';
import AgregarPago from '../pagos/AgregarPago';
import Pago from '../pagos/Pago';
import './venta.css';
import { MainContext } from '../context/MainContext';

export default function Venta (props) {
  const {ventaState: state, ventaDispatch: dispatch, tablaTipoPago} = useContext(MainContext);
  const {articuloData, setArticuloData, consumidorFinal, vendedor, turno} = useContext(MainContext);
  const [codigo, setCodigo] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const {constants: {DESCUENTO_MAXIMO}} = useContext(MainContext);
  const getTotal = () => state.items.reduce((total, item) => total + item.CANTIDAD * item.PRECIO_UNITARIO, 0);

  const getNuevaFactura = async () => {
    const lastNumeroFactura = await databaseRead.getLastNumeroFactura();
    dispatch({
      type: 'nuevaFactura',
      payload: {
        numeroFactura: lastNumeroFactura.lastId + 1,
        cliente: consumidorFinal,
        vendedor,
        turno,
        descuento: 0,
        pagos: [],
        items: [],
        tipoPago: tablaTipoPago[0],
        observaciones: ''
      }
    });
  };

  useEffect(() => {
    if (state.numeroFactura === 0) {
      getNuevaFactura();
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

  const postToAPI = async () => {
    try {
      const facturaId = await databaseWrite.postFactura({
        NUMERO_FACTURA: state.numeroFactura,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        DESCUENTO: state.descuento,
        OBSERVACIONES: state.observaciones,
        CLIENTE_ID: state.cliente.id,
        TURNO_ID: state.turno.id // TODO: MAKE TURNO
      });

      state.items.forEach(item => {
        databaseWrite.postItemFactura({
          FACTURA_ID: facturaId,
          CANTIDAD: item.CANTIDAD,
          PRECIO_UNITARIO: item.PRECIO_UNITARIO,
          DESCUENTO: item.DESCUENTO,
          ARTICULO_ID: item.id
        });
      });

      if (state.pagos.length === 0) {
        databaseWrite.postPago({
          FACTURA_ID: facturaId,
          MONTO: getTotal(),
          TIPO_PAGO_ID: state.tipoPago.id,
          ESTADO_ID: state.tipoPago.id === 1 ? 1 : 2 // TODO: BUSSINESS LOGIC; HANDLE IN A BETTER WAY
        });
      } else {
        state.pagos.forEach(pago => {
          databaseWrite.postPago({
            FACTURA_ID: facturaId,
            MONTO: pago.MONTO,
            TIPO_PAGO_ID: pago.TIPO_PAGO.id,
            ESTADO_ID: pago.ESTADO.id
          });
        });
      }

      dialogs.success(`FACTURA ${state.numeroFactura} REALIZADA!!!`);
      setTimeout(() => setArticuloData([]), 1000); // FIXME: HACKY
      getNuevaFactura();
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
  };

  function addPago (pago) {
    // TODO: insert pago logic here...
    dispatch({
      type: 'addPago',
      payload: pago
    });
  }

  function handleAgregarPago () {
    setModalContent(
      <AgregarPago
        handleSelection={addPago}
        setDisplayModal={setDisplayModal}
      />
    );
    setDisplayModal(true);
  }
  const vaciar = (event) => {
    const vaciarAction = {type: 'nuevaFactura', payload: {observaciones: '', items: [], pagos: [], descuento: 0}};
    dialogs.confirm(
      confirmed => confirmed && dispatch(vaciarAction), // Callback
      'VACIAR VENTA?', // Message text
      'SI', // Confirm text
      'NO' // Cancel text
    );
  };

  // // function processSeña () {
  // //   // TODO: process seña stuff
  // // }

  const articuloModal = () => {
    setModalContent(
      <ConsultaArticulo
        articuloData={articuloData}
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

  return (
    <React.Fragment>
      {
        displayModal && <Modal displayModal={displayModal} setDisplayModal={setDisplayModal}>
          {modalContent}
        </Modal>
      }

      <div className='panel'>
        <InputTextField name='Factura' value={state.numeroFactura} readOnly />
        <InputTextField name='Cliente' value={state.cliente.NOMBRE} readOnly onClick={clienteModal} />
      </div>
      <div className='panel'>
        <InputSelect table={tablaTipoPago} name='Tipos de pago' accessor='NOMBRE' value={state.tipoPago} setValue={tipoPago => dispatch({type: 'setTipoPago', payload: tipoPago})} />
        <InputFloatField name='Descuento' value={state.descuento} maxValue={DESCUENTO_MAXIMO} setValue={descuento => dispatch({type: 'setDescuento', payload: descuento})} autoComplete='off' />
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
            <th className='table-header-precio-base'>Precio Base</th>
            <th className='table-header-precio-unitario'>Precio Unitario</th>
            <th className='table-header-precio-total'>Precio Total</th>
            <th className='table-header-descuentos'>Descuento</th>
          </tr>
        </thead>
        <tbody id='tbody'>
          {state.items.map(item => <ItemArticulo
            key={item.id}
            dispatch={dispatch}
            articulo={item} />)}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan='4' />
            <th>TOTAL: </th>
            <th colSpan='2' id='table-footer-total'>
              {money(getTotal())}
            </th>
          </tr>
        </tfoot>
      </table>
      <div className='panel'>
        <InputTextField readOnly name='Vendedor' value={state.vendedor.NOMBRE} />
        <InputTextField readOnly name='Turno' value={state.turno.id} />
        <InputTextField readOnly name='Fecha' value={dateFormat(new Date(), 'MM/dd/yyyy')} />
      </div>
      <div className='panel'>
        <button className='codigo-search' onClick={handleSubmit}>AGREGAR VENTA</button>
        <button className='codigo-search' onClick={handleAgregarPago}>AGREGAR PAGO</button>
      </div>
      <div className='panel'>
        <button className='codigo-search' onClick={vaciar}>VACIAR VENTA</button>
      </div>
      {
        state.pagos.length > 0 &&
        <div className='panel' >
          <h3>PAGOS</h3>
          {state.pagos.map(pago => <Pago pago={pago} />)}
          <div>
            <p>TOTAL</p>
            <p>{state.pagos.reduce((total, pago) => total + pago.MONTO, 0)}</p>
          </div>
          <div>
            <p>PENDIENTE</p>
            <p>{getTotal() - state.pagos.reduce((total, pago) => total + pago.MONTO, 0)}</p>
          </div>
        </div>
      }
    </React.Fragment>
  );
}
