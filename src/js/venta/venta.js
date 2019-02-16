import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import {format as dateFormat} from 'date-fns';
// import {Input, InputText} from '../components/inputs';
import {errorShakeEffect} from '../components/effects';
import {condicionesPago, descuentoMax} from '../constants/bussinessConstants';
import Factura from './Factura';
import {condicionPagoDOM, descuentoDOM, codigoDOM} from '../utilities/selectors';

// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
let audioError = require('../../resources/audio/error.wav');
let audioOk = require('../../resources/audio/ok.wav');

initialLoad();

async function initialLoad () {
  const numeroFactura = await databaseRead.getNewNumeroFactura();
  const cliente = await databaseRead.getClienteById(1);
  const vendedor = await databaseRead.getVendedorById(1);

  window.factura = new Factura(numeroFactura, cliente, vendedor);

  Object.keys(condicionesPago).forEach(condicion => {
    var option = document.createElement('option');
    option.value = condicion;
    option.innerHTML = condicion;
    condicionPagoDOM.appendChild(option);
  });

  setTimeout(e => addVentaItem('ZH2932030828'), 500);
  setTimeout(e => addVentaItem('5985561826014'), 600);
  setTimeout(e => addVentaItem('4883803077006'), 700);
  setTimeout(e => addVentaItem('4883803077006'), 2000);
}

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

condicionPagoDOM.addEventListener('change', event => {
  window.factura.condicionDePago = event.target.value;
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
  Object.freeze(window.factura);
  const facturaId = await databaseWrite.postFactura(facturaJson);
  window.factura.itemsFactura.forEach(item => {
    databaseWrite.postItemFactura(item.toServerJsonAPI());
  });

  const monto = window.factura.montoTotal;

  if (this.state.condicionPago === 'EFECTIVO') {
    const pago = {
      FACTURA_ID: facturaId,
      MONTO: monto,
      TIPO_PAGO_ID: condicionesPago[this.state.condicionPago],
      ESTADO: 'PAGADO'
    };
    const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
    console.log(pagoId);
  } else {
    const pago = {
      FACTURA_ID: facturaId,
      MONTO: monto,
      TIPO_PAGO_ID: condicionesPago[this.state.condicionPago],
      ESTADO: 'PENDIENTE'
    };
    const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
    console.log(pagoId);
  }

  // TODO: actualizacion de STOCK luego de que toda la transaccion fue exitosa.

  // TODO: AFTER FINISHING REFRESH CURRENT NUMERO FACTURA, REFRESH INTERFACE
}

//   componentDidMount () {
//     // TODO: get turno
//     this.codigoInput.current.focus();
//   }

async function addVentaItem (codigo) { // ZH2932030828
  if (!codigo) return false;
  let articuloData = await databaseRead.getArticuloByCodigo(codigo);
  // if found in database, add, there can be no error after this;
  // else display error, codigo not found or database error.
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
