import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import {format as dateFormat} from 'date-fns';
import {errorShakeEffect} from '../components/effects';
import {getTiposDePago, descuentoMax} from '../constants/bussinessConstants';
import Factura from './Factura';
import {tiposPagoDOM, descuentoDOM, codigoDOM, fechaDOM} from '../utilities/selectors';

let audioError = require('../../resources/audio/error.wav');
let audioOk = require('../../resources/audio/ok.wav');
let tiposPago;

initialLoad();

async function initialLoad () {
  tiposPago = await getTiposDePago();
  await newFactura();
  tiposPago.forEach(tipoPago => {
    var option = document.createElement('option');
    option.value = tipoPago.id;
    option.innerHTML = tipoPago.NOMBRE;
    tiposPagoDOM.appendChild(option);
  });
  document.querySelector('html').style = 'visibility: visible;'; // RENDER ONLY AFTER LOADING THE PAGE
}

async function newFactura () {
  if (window.factura) {
    window.factura.removeFromDOM();
  }
  fechaDOM.value = dateFormat(new Date(), 'MM/dd/yyyy');
  const numeroFactura = await databaseRead.getNewNumeroFactura();
  const cliente = await databaseRead.getClienteById(1);
  const vendedor = await databaseRead.getVendedorById(1);
  const turno = await databaseRead.getTurnoActual();

  window.factura = new Factura(numeroFactura, cliente, vendedor, turno);
  // using global object.
  // is there a better way without reattaching the DOM nodes
  // or leaking memory with closures containing previous facturas?
}

// FIXME: THIS IS FOR TESINTG PURPOSES ONLY
document.addEventListener('dblclick', event => {
  if (event.shiftKey) {
    setTimeout(e => addVentaItem('ZH2932030828'), 500);
    setTimeout(e => addVentaItem('5985561826014'), 600);
    setTimeout(e => addVentaItem('4883803077006'), 700);
    setTimeout(e => addVentaItem('4883803077006'), 2000);
  }
});
document.addEventListener('keypress', event => {
  if (event.code === 'KeyA' && event.ctrlKey && event.shiftKey) {
    onSubmit(event);
  }
  if (event.code === 'Enter' && event.ctrlKey) {
    codigoDOM.focus();
  }
});

// REGISTER LISTENERS

// reject invalid positive float numbers
descuentoDOM.addEventListener('keydown', event => {
  if (event.key.length <= 1) {
    if (!/[0-9.]/.test(event.key) ||
        !/^\d*\.{0,1}\d*$/.test(event.target.value + event.key)) {
      event.preventDefault();
      errorShakeEffect(event.target);
      return false;
    }
  }
});

// allow for numbers unfinished ending in zeros or dots
descuentoDOM.addEventListener('input', event => {
  if (!/\d+[.0]+$/.test(event.target.value)) {
    event.target.value = parseFloat(event.target.value) || '0';
  }
  if (parseFloat(event.target.value) > descuentoMax) {
    event.target.value = descuentoMax;
    errorShakeEffect(event.target);
    // Toast(descuentoMax es el limite maximo);
  }
  window.factura.descuento = event.target.value;
});

tiposPagoDOM.addEventListener('change', event => {
  window.factura.tipoPago = tiposPago[event.target.value - 1];
});

codigoDOM.addEventListener('search', async (event) => {
  const added = await addVentaItem(event.target.value);
  if (added) {
    // positive feedback
    // TODO: TOAST?
    var aud = new window.Audio(audioOk);
    aud.play();
  } else {
    // negative feedback
    errorShakeEffect(event.target);
    var aud2 = new window.Audio(audioError);
    aud2.play();
  }
  event.target.value = '';
  event.target.focus();
});

async function onSubmit (event) {
  event.preventDefault();
  // TODO: POST DATA TO API AFTER CONFIRMATION AND VALIDATION
  // TODO: VALIDATIONS
  // TODO: make confirmation stage
  // TODO: inform user
  // TODO: CALL SUBMISSIONS

  let facturaJson = window.factura.toServerJsonAPI();
  const facturaId = await databaseWrite.postFactura(facturaJson);
  window.factura.itemsFactura.forEach(item => {
    console.log(item.toServerJsonAPI());
    databaseWrite.postItemFactura(item.toServerJsonAPI());
  });

  const precioTotal = window.factura.precioTotal;
  const tipoPagoId = window.factura.tipoPago.id; // FIXME RETURNS A OBJECT

  if (tipoPagoId === 1) { // ES EN EFECTIVO, DE CONTADO...
    const pago = {
      FACTURA_ID: facturaId,
      MONTO: precioTotal,
      TIPO_PAGO_ID: tipoPagoId,
      ESTADO: 'PAGADO'
    };
    const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
    console.log(pagoId);
  } else {
    const pago = {
      FACTURA_ID: facturaId,
      MONTO: precioTotal,
      TIPO_PAGO_ID: tipoPagoId,
      ESTADO: 'PENDIENTE'
    };
    const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
    console.log(pagoId);
  }
  newFactura();
}

async function addVentaItem (codigo) {
  if (!codigo) return false;
  let articuloData = await databaseRead.getArticuloByCodigo(codigo);
  // if found in database, add, there can be no error after this;
  // else display error, codigo not found or database error.
  // TODO: INFORM USER IN CASE OF ERROR
  if (articuloData !== undefined) {
    window.factura.addItem(articuloData);
  }

  return articuloData !== undefined;
}

// async function selectClient (nro) {
//   // TODO: SELECT A DIFFERENT CLIENT
// }

// function addPago () {
//   // TODO: add pagos
//   // TODO: VALIDATIONS
// }

// function processSeña () {
//   // TODO: process seña stuff
// }

// function articuloSearchFunctionality () {
//   // TODO: handle the selection and search of articulos
// }
//   */
