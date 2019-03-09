import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState, useContext, useReducer } from 'react';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import { InputTextField, InputSelect, InputFloatField } from '../components/inputs';
import Modal from '../components/modal';
import { ConfigContext } from '../context/ConfigContext';
import Consulta from '../crud/consulta';
import ConsultaArticulo from '../crud/consultaArticulo';
import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import dialogs from '../utilities/dialogs';
import { money } from '../utilities/format';
import ItemVenta from './ItemVenta';
import AgregarPago from './AgregarPago';
import Pago from './Pago';
import './venta.css';
import VentaReducer from './VentaReducer';

export default function Venta (props) {
  const [factura, dispatchFactura] = useReducer(VentaReducer.reducer, VentaReducer.initialState);
  const [codigo, setCodigo] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const {state: {DESCUENTO_MAXIMO}} = useContext(ConfigContext);
  const getTotal = () => factura.items.reduce((total, item) => total + item.CANTIDAD * item.PRECIO_UNITARIO, 0);

  const getNuevaFactura = async () => {
    const lastNumeroFactura = await databaseRead.getLastNumeroFactura();
    const cliente = await databaseRead.getItemById('cliente', 1);
    const vendedor = await databaseRead.getItemById('vendedor', 1);
    const turno = await databaseRead.getTurnoActual();
    dispatchFactura({
      type: 'nuevaFactura',
      payload: {
        numeroFactura: lastNumeroFactura.lastId + 1,
        cliente,
        vendedor,
        turno,
        descuento: 0,
        pagos: [],
        items: [],
        observaciones: ''
      }
    });
  };

  useEffect(() => {
    getNuevaFactura();
  }, []);

  const addVentaHandler = (event) => {
    if (!codigo) return false;
    if (event.which !== 13) return false;
    addVentaItem();
  };

  const addVentaItem = (data) => {
    const cod = data ? data.CODIGO : codigo;
    const articulo = factura.items.find(item => item.CODIGO === cod);
    if (articulo) {
      dispatchFactura({type: 'addOneQuantityItem', payload: cod});
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
            dispatchFactura({type: 'addItem', payload: res});
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
    if (factura.items.length === 0) {
      dialogs.error('Factura vacia; no agregada');
    } else {
      // TODO: VALIDATIONS
      dialogs.confirm(
        confirmed => confirmed && postFacturaToAPI(), // Callback
        'Confirmar venta?', // Message text
        'CONFIRMAR', // Confirm text
        'VOLVER' // Cancel text
      );
    }
  };

  const postFacturaToAPI = async () => {
    try {
      const facturaId = await databaseWrite.postFactura({
        NUMERO_FACTURA: factura.numeroFactura,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        DESCUENTO: factura.descuento,
        OBSERVACIONES: factura.observaciones,
        CLIENTE_ID: factura.cliente.id,
        TURNO_ID: factura.turno.id // TODO: MAKE TURNO
      });

      factura.items.forEach(item => {
        databaseWrite.postItemFactura({
          FACTURA_ID: facturaId,
          CANTIDAD: item.CANTIDAD,
          PRECIO_UNITARIO: item.PRECIO_UNITARIO,
          DESCUENTO: item.DESCUENTO,
          ARTICULO_ID: item.id
        });
      });

      if (factura.pagos.length === 0) {
        databaseWrite.postPago({
          FACTURA_ID: facturaId,
          MONTO: getTotal(),
          TIPO_PAGO_ID: factura.tipoPago.id,
          ESTADO_ID: factura.tipoPago.id === 1 ? 1 : 2 // TODO: BUSSINESS LOGIC; HANDLE IN A BETTER WAY
        });
      } else {
        factura.pagos.forEach(pago => {
          databaseWrite.postPago({
            FACTURA_ID: facturaId,
            MONTO: pago.MONTO,
            TIPO_PAGO_ID: pago.TIPO_PAGO.id,
            ESTADO: pago.ESTADO.id
          });
        });
      }

      dialogs.success(`FACTURA ${factura.numeroFactura} REALIZADA!!!`);
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }

    props.updateArticuloData();
    getNuevaFactura();
  };

  function addPago (pago) {
    dispatchFactura({
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

  // // function processSeña () {
  // //   // TODO: process seña stuff
  // // }

  const articuloModal = () => {
    setModalContent(
      <ConsultaArticulo
        articuloData={props.articuloData}
        handleSelection={addVentaItem}
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
        handleSelection={obj => dispatchFactura({type: 'setCliente', payload: obj})} />
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
        <InputTextField name='Factura' value={factura.numeroFactura} readOnly />
        <InputTextField name='Cliente' value={factura.cliente.NOMBRE} readOnly onClick={clienteModal} />
      </div>
      <div className='panel'>
        <InputSelect table='TIPO_PAGO' name='Tipos de pago' accessor='NOMBRE' value={factura.tipoPago} setValue={tipoPago => dispatchFactura({type: 'setTipoPago', payload: tipoPago})} />
        <InputFloatField name='Descuento' value={factura.descuento} maxValue={DESCUENTO_MAXIMO} setValue={descuento => dispatchFactura({type: 'setDescuento', payload: descuento})} autoComplete='off' />
      </div>
      <div className='panel'>
        <InputTextField name='Codigo' value={codigo} autoFocus autoComplete='off' onKeyPress={addVentaHandler} onChange={event => setCodigo(event.target.value)} />
        <button className='codigo-search' onClick={articuloModal}>BUSCAR ARTICULO</button>
      </div>
      <div className='panel'>
        <InputTextField name='Observaciones' value={factura.observaciones} onChange={event => dispatchFactura({type: 'setObservaciones', payload: event.target.value})} />
      </div>
      <table id='table'>
        <thead>
          <tr>
            <th className='table-header-cantidad'>Cant</th>
            <th className='table-header-codigo'>Codigo</th>
            <th className='table-header-descripcion'>Descripcion</th>
            <th className='table-header-stock'>Stock</th>
            <th className='table-header-precio-base'>Precio Base</th>
            <th className='table-header-precio-unitario'>Precio Unitario</th>
            <th className='table-header-precio-total'>Precio Total</th>
            <th className='table-header-descuentos'>Descuento</th>
          </tr>
        </thead>
        <tbody id='tbody'>
          {factura.items.map(item => <ItemVenta
            key={item.id}
            dispatchFactura={dispatchFactura}
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
        <InputTextField readOnly name='Vendedor' value={factura.vendedor.NOMBRE} />
        <InputTextField readOnly name='Turno' value={factura.turno.id} />
        <InputTextField readOnly name='Fecha' value={dateFormat(new Date(), 'MM/dd/yyyy')} />
      </div>
      <div className='panel'>
        <button className='codigo-search' onClick={handleSubmit}>AGREGAR VENTA</button>
        <button className='codigo-search' onClick={handleAgregarPago}>AGREGAR PAGO</button>
      </div>
      {
        factura.pagos.length > 0 &&
        <div className='panel' >
          <h3>PAGOS</h3>
          {factura.pagos.map(pago => <Pago pago={pago} />)}
        </div>
      }
    </React.Fragment>
  );
}
