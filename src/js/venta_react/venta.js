import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import {format as dateFormat} from 'date-fns';
import {errorShakeEffect} from '../components/effects';
import dialogs from '../utilities/dialogs';
import {descuentoMax} from '../constants/bussinessConstants';
import Factura from './Factura';
import * as d3Format from 'd3-format';
import {round} from '../utilities/math';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
const money = d3Format.formatLocale({
  'decimal': ',',
  'thousands': '.',
  'grouping': [3],
  'currency': ['$', '']
}).format('($,.2f');

let audioError = require('../../resources/audio/error.wav');
let audioOk = require('../../resources/audio/ok.wav');

function ItemVenta ({articulo, tipoPago, descuento, items, setItems}) {
  const precioBase = articulo[tipoPago === 'EFECTIVO' ? 'PRECIO_CONTADO' : 'PRECIO_LISTA'];
  const precioUnitario = round(precioBase * (1 - descuento / 100) * (1 - articulo.DESCUENTO / 100));
  const precioTotal = precioUnitario * articulo.CANTIDAD;

  const cantidadHandler = event => {
    const newCantidad = isNaN(parseInt(event.target.value)) ? 1 : parseInt(event.target.value);
    setItems(items.map(item => item.CODIGO === articulo.CODIGO ? {...item, CANTIDAD: newCantidad} : item));
  };

  return (
    <tr>
      <td className='table-cell-cantidad'><input type='number' value={articulo.CANTIDAD} min='0' onChange={cantidadHandler} /></td>
      <td className='table-cell-codigo'>{articulo.CODIGO}</td>
      <td className='table-cell-descripcion'>{articulo.DESCRIPCION}</td>
      <td className={'table-cell-stock ' + articulo.STOCK < 0 ? 'low-stock' : ''}>{articulo.STOCK}</td>
      <td className='table-cell-precioBase'>{money(precioBase)}</td>
      <td className='table-cell-precioUnitario'><input type='number' value={precioUnitario} min='0' /></td>
      <td className='table-cell-precioTotal'>{money(precioTotal)}</td>
      <td className='table-cell-descuentoIndividual'><input type='number' value={articulo.DESCUENTO} min='0' max={descuentoMax} /></td>
    </tr>
  );
}

function Venta () {
  const [numeroFactura, setNumeroFactura] = useState(0);
  const [cliente, setCliente] = useState({id: 0, NOMBRE: ''});
  const [vendedor, setVendedor] = useState({id: 0, NOMBRE: ''});
  const [fecha, setFecha] = useState(new Date());
  const [descuento, setDescuento] = useState(0);
  const [turno, setTurno] = useState({id: 0});
  const [tipoPago, setTipoPago] = useState('EFECTIVO');
  const [tiposPago, setTiposPago] = useState([{id: 0, NOMBRE: ''}]);
  const [items, setItems] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    databaseRead.getTable('TIPO_PAGO')
      .then(res => {
        setTiposPago(res);
        setTipoPago(res[0].NOMBRE);
        document.querySelector('html').style = 'visibility: visible;'; // RENDER ONLY AFTER LOADING THE PAGE
      });
  }, []);

  useEffect(() => {
    databaseRead.getLastNumeroFactura().then(res => setNumeroFactura(res.lastId + 1));
    databaseRead.getClienteById(1).then(res => setCliente(res));
    databaseRead.getVendedorById(1).then(res => setVendedor(res));
    databaseRead.getTurnoActual().then(res => setTurno(res));
  }, [numeroFactura]);

  const getTotal = () => items.reduce((total, item) => total +
    round(item[tipoPago === 'EFECTIVO' ? 'PRECIO_CONTADO' : 'PRECIO_LISTA'] * (1 - descuento / 100) * (1 - item.DESCUENTO / 100) * item.CANTIDAD), 0);

    // // reject invalid positive float numbers
  const validFloats = event => {
    if (event.key.length <= 1) {
      if (!/[0-9.]/.test(event.key) ||
        !/^\d*\.{0,1}\d*$/.test(event.target.value + event.key)) {
        event.preventDefault();
        errorShakeEffect(event.target);
        return false;
      }
    }
  };

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

  return (
    <React.Fragment>
      <div className='panel'>
        <div>
          <label className='venta__label' htmlFor='venta-factura'>Factura</label>
          <input type='text' readOnly name='venta-factura' id='venta-factura' value={numeroFactura} />
        </div>
        <div>
          <label className='venta__label' htmlFor='venta-cliente'>Cliente</label>
          <input type='text' readOnly name='venta-cliente' id='venta-cliente' value={cliente.NOMBRE} />
        </div>
      </div>
      <div className='panel'>
        <div>
          <label htmlFor='venta-tipos-de-pago'>Tipo de Pago</label>
          <select name='venta-tipos-de-pago' id='venta-tipos-de-pago' value={tipoPago} onChange={event => setTipoPago(event.target.value)}>
            {tiposPago.map(e => <option key={e.id} value={e.NOMBRE}>{e.NOMBRE}</option>)}
          </select>
        </div>
        <div>
          <label className='venta__label' htmlFor='venta-descuento'>Descuento</label>
          <input type='text' autoComplete='off' name='venta-descuento' id='venta-descuento' value={descuento} onKeyPress={validFloats} onChange={handleDescuento} />
        </div>
      </div>
      <div className='panel'>
        <div>
          <label className='venta__label' htmlFor='venta-codigo'>ZH2932030828</label>
          <input type='search' autoFocus autoComplete='off' name='venta-codigo' id='venta-codigo' value={codigo} onKeyPress={addVentaItem} onChange={event => setCodigo(event.target.value)} />
        </div>
        <button className='codigo-search'>BUTTON</button>
      </div>
      <div className='panel'>
        <div>
          <label className='venta__label' htmlFor='venta-observaciones'>Observaciones</label>
          <input type='text' name='venta-observaciones' id='venta-observaciones' value={observaciones} onChange={event => setObservaciones(event.target.value)} />
        </div>
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
        <div>
          <label className='venta__label' htmlFor='venta-vendedor'>Vendedor</label>
          <input type='text' disabled readOnly name='venta-vendedor' id='venta-vendedor' value={vendedor.NOMBRE} />
        </div>
        <div>
          <label className='venta__label' htmlFor='venta-turno'>Turno</label>
          <input type='text' disabled readOnly name='venta-turno' id='venta-turno' value={turno.id} />
        </div>
        <div>
          <label className='venta__label' htmlFor='venta-fecha'>Fecha</label>
          <input type='text' disabled name='venta-fecha' id='venta-fecha' value={dateFormat(fecha, 'MM/dd/yyyy')} />
        </div>
      </div>
    </React.Fragment>
  );
}

ReactDOM.render(<Venta />, document.getElementById('root'));

// // reject invalid positive float numbers
// descuentoDOM.addEventListener('keydown', event => {
//   if (event.key.length <= 1) {
//     if (!/[0-9.]/.test(event.key) ||
//         !/^\d*\.{0,1}\d*$/.test(event.target.value + event.key)) {
//       event.preventDefault();
//       errorShakeEffect(event.target);
//       return false;
//     }
//   }
// });

// // allow for numbers unfinished ending in zeros or dots
// descuentoDOM.addEventListener('input', event => {
//   if (!/\d+[.0]+$/.test(event.target.value)) {
//     event.target.value = parseFloat(event.target.value) || '0';
//   }
//   if (parseFloat(event.target.value) > descuentoMax) {
//     event.target.value = descuentoMax;
//     errorShakeEffect(event.target);
//     dialogs.error(
//       'EL LIMITE DE DESCUENTO ES ' + parseFloat(event.target.value).toFixed(2), // Message text
//       {} // Additional options
//     );
//   }
//   window.factura.descuento = event.target.value;
// });

// async function onSubmit (event) {
//   event.preventDefault();
//   // TODO: POST DATA TO API AFTER CONFIRMATION AND VALIDATION
//   // TODO: VALIDATIONS
//   // TODO: make confirmation stage
//   // TODO: inform user
//   // TODO: CALL SUBMISSIONS

//   let facturaJson = window.factura.toServerJsonAPI();
//   const facturaId = await databaseWrite.postFactura(facturaJson);
//   window.factura.itemsFactura.forEach(item => {
//     console.log(item.toServerJsonAPI());
//     databaseWrite.postItemFactura(item.toServerJsonAPI());
//   });

//   const precioTotal = window.factura.precioTotal;
//   const tipoPagoId = window.factura.tipoPago.id; // FIXME RETURNS A OBJECT

//   if (tipoPagoId === 1) { // ES EN EFECTIVO, DE CONTADO...
//     const pago = {
//       FACTURA_ID: facturaId,
//       MONTO: precioTotal,
//       TIPO_PAGO_ID: tipoPagoId,
//       ESTADO: 'PAGADO'
//     };
//     const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
//     console.log(pagoId);
//   } else {
//     const pago = {
//       FACTURA_ID: facturaId,
//       MONTO: precioTotal,
//       TIPO_PAGO_ID: tipoPagoId,
//       ESTADO: 'PENDIENTE'
//     };
//     const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
//     console.log(pagoId);
//   }
//   newFactura();
// }

// async function addVentaItem (codigo) {
//   if (!codigo) return false;
//   let articuloData = await databaseRead.getArticuloByCodigo(codigo);
//   // if found in database, add, there can be no error after this;
//   // else display error, codigo not found or database error.
//   // TODO: INFORM USER IN CASE OF ERROR
//   if (articuloData.id) {
//     window.factura.addItem(articuloData);
//   } else {

//   }

//   return !!(articuloData.id);
// }

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
// //   */
