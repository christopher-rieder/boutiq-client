import { format as dateFormat } from 'date-fns';
import React, { useState, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import { UncontrolledInput, InputTextField, InputSelect, InputFloatField } from '../components/inputs';
import Modal from '../components/modal';
import Consulta from '../crud/consulta';
import ConsultaArticulo from '../crud/consultaArticulo';
import * as databaseRead from '../database/getData';
import {postObjectToAPI} from '../database/writeData';
import dialogs from '../utilities/dialogs';
import { money } from '../utilities/format';
import ItemArticulo from '../components/ItemArticulo';
import AgregarPago from '../pagos/AgregarPago';
import Pago from '../pagos/Pago';
import './venta.css';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import MoneyIcon from '@material-ui/icons/MonetizationOnTwoTone';
import SendIcon from '@material-ui/icons/SendTwoTone';
import SearchIcon from '@material-ui/icons/Search';

const numeroFormWidth = {width: '5rem'};
const codigoFormWidth = {width: '15rem'};
const observacionesFormWidth = {width: '40vw'};
const agregarPagoColor = {color: 'green'};

const requestLastNumeroVenta = () => (dispatch) => {
  dispatch({type: 'REQUEST_LAST_VENTA_PENDING'});
  databaseRead.getLastNumeroFactura()
    .then(lastId => dispatch({type: 'REQUEST_LAST_VENTA_SUCCESS', payload: lastId}))
    .catch(error => dispatch({type: 'REQUEST_LAST_VENTA_FAILED', payload: error}));
};

const mapStateToProps = state => ({
  descuento: state.venta.descuento,
  cliente: state.venta.cliente,
  tipoPago: state.venta.tipoPago,
  observaciones: state.venta.observaciones,
  numeroFactura: state.venta.numeroFactura,
  pagos: state.venta.pagos,
  items: state.venta.items,
  isPending: state.venta.isPending,
  error: state.venta.error,
  DESCUENTO_MAXIMO: state.constants.DESCUENTO_MAXIMO,
  clienteDefault: state.defaults.clienteDefault,
  vendedor: state.session.vendedor,
  turno: state.session.turno,
  tablaTipoPago: state.tabla.tipoPago
});

const mapDispatchToProps = dispatch => ({
  addOne: (codigo) => dispatch({type: 'venta_addOneQuantityItem', payload: codigo}),
  addItem: (articulo) => dispatch({type: 'venta_addItem', payload: articulo}),
  addPago: (pago) => dispatch({type: 'venta_addPago', payload: pago}),
  vaciar: () => dispatch({type: 'venta_vaciar'}),
  setCliente: (cliente) => dispatch({type: 'venta_setCliente', payload: cliente}),
  setTipoPago: (tipoPago) => dispatch({type: 'venta_setTipoPago', payload: tipoPago}),
  setDescuento: (descuento) => dispatch({type: 'venta_setDescuento', payload: descuento}),
  setObservaciones: (observaciones) => dispatch({type: 'venta_setObservaciones', payload: observaciones}),
  nuevo: (obj) => dispatch({type: 'venta_nueva', payload: obj}),
  onRequestLastVenta: () => dispatch(requestLastNumeroVenta()),
  setDescuentoIndividual: (articulo) => event => dispatch({type: 'venta_setDescuentoIndividual', payload: {articulo, value: event.target.value}}),
  setPrecioIndividual: (articulo) => event => dispatch({type: 'venta_setPrecioIndividual', payload: {articulo, value: event.target.value}}),
  setCantidadIndividual: (articulo) => event => dispatch({type: 'venta_setCantidadIndividual', payload: {articulo, value: event.target.value}}),
  removeItem: (articulo) => () => dispatch({type: 'venta_removeItem', payload: articulo}),
  updateCantidadArticulo: (id, cantidad, suma) => dispatch({type: 'UPDATE_ARTICULO_CANTIDAD', payload: {id, cantidad, suma}})
});

function Venta ({items, numeroFactura, descuento, observaciones, cliente, pagos, tipoPago,
  nuevo, onRequestLastVenta, addOne, addItem, addPago, vaciar,
  setCliente, setTipoPago, setDescuento, setObservaciones,
  setDescuentoIndividual, setPrecioIndividual, setCantidadIndividual, removeItem,
  DESCUENTO_MAXIMO, clienteDefault, vendedor, turno, tablaTipoPago, updateCantidadArticulo}) {
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  const getTotal = useMemo(
    () => items.reduce((total, item) => total + item.CANTIDAD * item.PRECIO_UNITARIO, 0),
    [items]);

  const getNuevaFactura = () => {
    onRequestLastVenta();
    vaciar();
    nuevo({
      cliente: clienteDefault,
      vendedor,
      turno,
      tipoPago: tablaTipoPago[0]
    });
  };

  useEffect(() => {
    getNuevaFactura();
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
          if (!res || res.length === 0) {
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
      const facturaId = await postObjectToAPI({
        NUMERO_FACTURA: numeroFactura,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        DESCUENTO: descuento,
        OBSERVACIONES: observaciones,
        CLIENTE_ID: cliente.id,
        TURNO_ID: turno.id
      }, 'factura').then(json => json.lastId);

      items.forEach(item => {
        // updating local state, same thing happens in the backend
        updateCantidadArticulo(item.id, item.CANTIDAD, false);
        postObjectToAPI({
          FACTURA_ID: facturaId,
          CANTIDAD: item.CANTIDAD,
          PRECIO_UNITARIO: item.PRECIO_UNITARIO,
          DESCUENTO: item.DESCUENTO,
          ARTICULO_ID: item.id
        }, 'itemFactura');
      });

      if (pagos.length === 0) {
        postObjectToAPI({
          FACTURA_ID: facturaId,
          MONTO: getTotal,
          TIPO_PAGO_ID: tipoPago.id,
          ESTADO_ID: tipoPago.id === 1 ? 1 : 2 // TODO: BUSSINESS LOGIC; HANDLE IN A BETTER WAY
        }, 'pago');
      } else {
        pagos.forEach(pago => {
          postObjectToAPI({
            FACTURA_ID: facturaId,
            MONTO: pago.MONTO,
            TIPO_PAGO_ID: pago.TIPO_PAGO.id,
            ESTADO_ID: pago.ESTADO.id
          }, 'pago');
        });
      }

      dialogs.success(`FACTURA ${numeroFactura} REALIZADA!!!`);
      getNuevaFactura();
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }
  };

  function handleAddPago (pago) {
    // TODO: insert pago logic here...
    addPago(pago);
  }

  const handleVaciar = (event) => {
    dialogs.confirm(
      confirmed => confirmed && vaciar(), // Callback
      'VACIAR VENTA?', // Message text
      'SI', // Confirm text
      'NO' // Cancel text
    );
  };

  function handleSeña () {
    // TODO: process seña stuff
  }

  function pagoModal () {
    setModalContent(
      <AgregarPago
        handleSelection={handleAddPago}
        setDisplayModal={setDisplayModal}
      />
    );
    setDisplayModal(true);
  }

  const articuloModal = () => {
    setModalContent(
      <ConsultaArticulo
        handleSelection={handleAddItem}
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

      <div className='input-grid'>
        <InputTextField style={numeroFormWidth} name='Factura' value={numeroFactura} readOnly />
        <InputTextField name='Cliente' value={cliente.NOMBRE} readOnly onClick={clienteModal} />
        <InputSelect table={tablaTipoPago} name='Tipos de pago' accessor='NOMBRE' value={tipoPago} setValue={setTipoPago} />
        <InputFloatField name='Descuento' value={descuento} maxValue={DESCUENTO_MAXIMO} setValue={setDescuento} autoComplete='off' />
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
            <th className='table-header-stock-nuevo'>Stock Nuevo</th>
            <th className='table-header-precio-base'>Precio Base</th>
            <th className='table-header-precio-unitario'>Precio Unitario</th>
            <th className='table-header-precio-total'>Precio Total</th>
            <th className='table-header-descuentos'>Descuento</th>
          </tr>
        </thead>
        <tbody id='tbody'>
          {items.map(item => <ItemArticulo
            key={item.id}
            setDescuentoIndividual={setDescuentoIndividual(item)}
            setCantidadIndividual={setCantidadIndividual(item)}
            setPrecioIndividual={setPrecioIndividual(item)}
            removeItem={removeItem(item)}
            articulo={item} />)}
        </tbody>
        <tfoot>
          <tr>
            <th colSpan='4' />
            <th>TOTAL: </th>
            <th colSpan='2' id='table-footer-total'>
              {money(getTotal)}
            </th>
          </tr>
        </tfoot>
      </table>
      <div className='panel'>
        <InputTextField readOnly name='Vendedor' value={vendedor.NOMBRE} />
        <InputTextField readOnly name='Turno' value={turno.id} />
        <InputTextField readOnly name='Fecha' value={dateFormat(new Date(), 'MM/dd/yyyy')} />
      </div>
      <div className='panel'>
        <Button variant='outlined' style={agregarPagoColor} onClick={pagoModal} >
          Agregar Pago &nbsp;
          <MoneyIcon />
        </Button>
        <Button variant='outlined' color='secondary' onClick={handleVaciar}>
          Vaciar &nbsp;
          <DeleteIcon />
        </Button>
        <Button variant='contained' color='primary' onClick={handleSubmit}>
          Realizar Venta &nbsp;
          <SendIcon />
        </Button>
      </div>
      {
        pagos.length > 0 &&
        <div className='panel' >
          <h3>PAGOS</h3>
          {pagos.map(pago => <Pago pago={pago} />)}
          <div>
            <p>TOTAL</p>
            <p>{pagos.reduce((total, pago) => total + pago.MONTO, 0)}</p>
          </div>
          <div>
            <p>PENDIENTE</p>
            <p>{getTotal - pagos.reduce((total, pago) => total + pago.MONTO, 0)}</p>
          </div>
        </div>
      }
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Venta);
