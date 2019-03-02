import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import { errorShakeEffect } from '../components/effects';
import { descuentoMax } from '../constants/bussinessConstants';
import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import { validFloats } from '../utilities/commonHandlers';
import dialogs from '../utilities/dialogs';
import { money } from '../utilities/format';
import { round } from '../utilities/math';
import { InputTextField } from '../components/inputs';
import ItemVenta from './ItemVenta';
import Modal from '../components/modal';
import Crud from '../crud/crud';
import './venta.css';

function Venta () {
  const [numeroFactura, setNumeroFactura] = useState(0);
  const [cliente, setCliente] = useState({id: 0, NOMBRE: ''});
  const [vendedor, setVendedor] = useState({id: 0, NOMBRE: ''});
  const [descuento, setDescuento] = useState(0);
  const [turno, setTurno] = useState({id: 0});
  const [tipoPago, setTipoPago] = useState({id: 1, NOMBRE: 'EFECTIVO'});
  const [tiposPago, setTiposPago] = useState([{id: 0, NOMBRE: ''}]);
  const [items, setItems] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [displayModal, setDisplayModal] = useState(false);

  useEffect(() => {
    databaseRead.getTable('TIPO_PAGO')
      .then(res => {
        setTiposPago(res);
        setTipoPago(res[0]);
      });
  }, []);

  useEffect(() => {
    databaseRead.getLastNumeroFactura().then(res => setNumeroFactura(res.lastId + 1));
    databaseRead.getClienteById(1).then(res => setCliente(res));
    databaseRead.getVendedorById(1).then(res => setVendedor(res));
    databaseRead.getTurnoActual().then(res => setTurno(res));
    setDescuento(0);
    setItems([]);
    setObservaciones('');
  }, [numeroFactura]);

  const getTotal = () => items.reduce((total, articulo) => {
    const precioBase = articulo[tipoPago.id === 1 ? 'PRECIO_CONTADO' : 'PRECIO_LISTA'];
    const precioUnitario = articulo.PRECIO_CUSTOM || round(precioBase * (1 - descuento / 100) * (1 - articulo.DESCUENTO / 100));
    const precioTotal = precioUnitario * articulo.CANTIDAD;
    return total + precioTotal;
  }, 0);

  // allow for numbers unfinished ending in zeros or dots
  const handleDescuento = event => {
    if (!/\d+[.0]+$/.test(event.target.value)) {
      event.target.value = parseFloat(event.target.value) || '0';
    }
    if (parseFloat(event.target.value) > descuentoMax) {
      event.target.value = descuentoMax;
      errorShakeEffect(event.target);
      dialogs.error(
        'EL LIMITE DE DESCUENTO ES ' + parseFloat(event.target.value).toFixed(2), // Message text
        {} // Additional options
      );
    }
    setDescuento(event.target.value);
  };

  const addVentaItem = (event) => {
    if (!codigo) return false;
    if (event.which !== 13) return false;
    let articulo = items.find(item => item.CODIGO === codigo);
    if (articulo) {
      setItems(items.map(item => item.CODIGO === codigo ? {...item, CANTIDAD: item.CANTIDAD + 1} : item));
      dialogs.success('AGREGADO!!!');
      var aud = new window.Audio(audioOk);
      aud.play();
    } else { // add new articulo
      databaseRead.getArticuloByCodigo(codigo)
        .then(res => {
          if (res.length === 0) {
            dialogs.error('CODIGO NO EXISTENTE');
            var aud2 = new window.Audio(audioError);
            aud2.play();
          } else {
            res.CANTIDAD = 1;
            res.DESCUENTO = res.PROMO_BOOL ? res.DESCUENTO_PROMO : 0;
            setItems(items.concat(res));
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
    // TODO: VALIDATIONS
    dialogs.confirm(
      confirmed => {
        if (confirmed) {
          postFacturaToAPI();
        } else {
          // do nothing
        }
      }, // Callback
      'Confirmar venta?', // Message text
      'CONFIRMAR', // Confirm text
      'VOLVER', // Cancel text
      {} // Additional options
    );
  };

  const postFacturaToAPI = async () => {
    try {
      const facturaId = await databaseWrite.postFactura({
        NUMERO_FACTURA: numeroFactura,
        FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
        DESCUENTO: descuento,
        CLIENTE_ID: cliente.id,
        TURNO_ID: turno.id // TODO: MAKE TURNO
      });

      items.forEach(item => {
        databaseWrite.postItemFactura({
          FACTURA_ID: facturaId,
          CANTIDAD: item.CANTIDAD,
          PRECIO_UNITARIO: item.PRECIO_UNITARIO,
          DESCUENTO: item.DESCUENTO,
          ARTICULO_ID: item.id
        });
      });

      databaseWrite.postPago({
        FACTURA_ID: facturaId,
        MONTO: getTotal(),
        TIPO_PAGO_ID: tipoPago.id,
        ESTADO: tipoPago.id === 1 ? 'PAGADO' : 'PENDIENTE'
      });

      dialogs.success(`FACTURA ${numeroFactura} REALIZADA!!!`);
    } catch (err) {
      dialogs.error(`ERROR! ${err}`);
    }

    setNumeroFactura(numeroFactura + 1);
  };

  // // async function selectClient (nro) {
  // //   // TODO: SELECT A DIFFERENT CLIENT
  // // }

  // // function addPago () {
  // //   // TODO: add pagos
  // //   // TODO: VALIDATIONS
  // // }

  // // function processSeña () {
  // //   // TODO: process seña stuff
  // // }

  // // function articuloSearchFunctionality () {
  // //   // TODO: handle the selection and search of articulos
  // // }

  return (
    <React.Fragment>
      {
        displayModal && <Modal displayModal={displayModal} setDisplayModal={setDisplayModal}>
          <Crud crudTable='marca' />
        </Modal>
      }

      <div className='panel'>
        <InputTextField name='Factura' value={numeroFactura} readOnly />
        <InputTextField name='Cliente' value={cliente.NOMBRE} readOnly />
      </div>
      <div className='panel'>
        <div>
          <label htmlFor='venta-tipos-de-pago'>Tipo de Pago</label>
          <select className='main_input-rename' name='venta-tipos-de-pago' id='venta-tipos-de-pago' value={tipoPago.NOMBRE} onChange={event => setTipoPago(tiposPago.find(tipo => tipo.NOMBRE === event.target.value))}>
            {tiposPago.map(e => <option key={e.id} value={e.NOMBRE}>{e.NOMBRE}</option>)}
          </select>
        </div>
        <InputTextField name='Descuento' value={descuento} autoComplete='off' onKeyPress={validFloats} onChange={handleDescuento} />
      </div>
      <div className='panel'>
        <InputTextField name='Codigo' value={codigo} autoFocus autoComplete='off' onKeyPress={addVentaItem} onChange={event => setCodigo(event.target.value)} />
        <button className='codigo-search' onClick={handleSubmit}>BUTTON</button>
        <button className='codigo-search' onClick={() => setDisplayModal(true)}>MODAL</button>
      </div>
      <div className='panel'>
        <InputTextField name='Observaciones' value={observaciones} onChange={event => setObservaciones(event.target.value)} />
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
          {items.map(item => <ItemVenta
            key={item.id}
            items={items}
            setItems={setItems}
            articulo={item}
            tipoPago={tipoPago}
            descuento={descuento} />)}
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
        <InputTextField readOnly name='Vendedor' value={vendedor.NOMBRE} />
        <InputTextField readOnly name='Turno' value={turno.id} />
        <InputTextField readOnly name='Fecha' value={dateFormat(new Date(), 'MM/dd/yyyy')} />
      </div>
    </React.Fragment>
  );
}

ReactDOM.render(<Venta />, document.getElementById('root'));
