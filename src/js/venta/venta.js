import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import {format as dateFormat} from 'date-fns';
// import {Input, InputText} from '../components/inputs';
import {errorShakeEffect} from '../components/effects';
import {condicionesPago, descuentoMax} from '../constants/bussinessConstants';
import Factura from './Factura';
import {condicionPagoDOM, descuentoDOM} from '../utilities/selectors';

// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
let audioError = require('../../resources/audio/error.wav');
let audioOk = require('../../resources/audio/ok.wav');

initialLoad();

window.factura = new Factura();

async function initialLoad () {
  window.factura.numeroFactura = await databaseRead.getNewNumeroFactura();
  window.factura.cliente = await databaseRead.getClienteById(1);
  window.factura.vendedor = await databaseRead.getVendedorById(1);
  Object.keys(condicionesPago).forEach(condicion => {
    var option = document.createElement('option');
    option.value = condicion;
    option.innerHTML = condicion;
    condicionPagoDOM.appendChild(option);
  });
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
  window.factura.descuento = event.target.value;
});

condicionPagoDOM.addEventListener('change', event => {
  window.factura.condicionDePago = event.target.value;
});

// class Venta extends Component {
//   constructor (props) {
//     super(props);
//     this.state = {
//       dataset: [],
//       codigo: '',
//       condicionPago: 'EFECTIVO',
//     };
//   }

//   handleDescuento (event) {
//     let descuento = event.target.value;
//     this.setState(prevState => {
//       if (/^[1-9]\d*\.$/.test(descuento)) {
//         return {descuento}; // Allow ending in dot without processing, for floats numbers.
//       } else if (/^[1-9]\d*\.?\d*$/.test(descuento) || descuento === '') { // valid positive float
//         descuento = parseFloat(descuento) || '';
//         if (descuento > descuentoMax) {
//           descuento = descuentoMax;
//           errorShakeEffect(this.descuentoInput.current);
//           // Toast(descuentoMax es el limite maximo);
//         }
//         this.updateAllPrices(descuento, this.state.condicionPago);
//         return {descuento};
//       } else {
//         errorShakeEffect(this.descuentoInput.current);
//         this.updateAllPrices(prevState.descuento, this.state.condicionPago);
//         return prevState;
//       }
//     });
//   }

//   handleCondicionPago (event) {
//     this.setState({condicionPago: event.target.value});
//     this.updateAllPrices(this.state.descuento, event.target.value);
//   }

//   async onSubmit (event) {
//     event.preventDefault();
//     // TODO: POST DATA TO API AFTER CONFIRMATION AND VALIDATION
//     // TODO: VALIDATIONS
//     // TODO: make confirmation stage
//     // TODO: inform user
//     // TODO: CALL SUBMISSIONS

//     let descuento = parseFloat(this.state.descuento) || 0;

//     let factura = {
//       NUMERO_FACTURA: this.state.currentNroFactura,
//       FECHA_HORA: new Date().getTime(), // UNIX EPOCH TIME
//       DESCUENTO: descuento,
//       CLIENTE_ID: this.state.cliente.id,
//       TURNO_ID: 0, // TODO: MAKE TURNO
//       ANULADA: 0 // FIXME: SQLITE BOOLEANS... NOT EXISTENT
//     };

//     const facturaId = await databaseWrite.postFactura(factura);

//     this.state.dataset.forEach(({id, CANTIDAD, PRECIO_UNITARIO, DESCUENTO}) => {
//       let item = {CANTIDAD, PRECIO_UNITARIO, DESCUENTO};
//       item.ARTICULO_ID = id;
//       item.FACTURA_ID = facturaId;
//       item.DESCUENTO = DESCUENTO || 0;
//       databaseWrite.postItemFactura(item);
//     });

//     const monto = this.state.dataset.reduce((monto, item) => monto + item.PRECIO_UNITARIO * item.CANTIDAD, 0);

//     if (this.state.condicionPago === 'EFECTIVO') {
//       const pago = {
//         FACTURA_ID: facturaId,
//         MONTO: monto,
//         TIPO_PAGO_ID: condicionesPago[this.state.condicionPago],
//         ESTADO: 'PAGADO'
//       };
//       const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
//       console.log(pagoId);
//     } else {
//       const pago = {
//         FACTURA_ID: facturaId,
//         MONTO: monto,
//         TIPO_PAGO_ID: condicionesPago[this.state.condicionPago],
//         ESTADO: 'PENDIENTE'
//       };
//       const pagoId = await databaseWrite.postObjectToAPI(pago, 'pago');
//       console.log(pagoId);
//     }

//     // TODO: actualizacion de STOCK luego de que toda la transaccion fue exitosa.

//     // TODO: AFTER FINISHING REFRESH CURRENT NUMERO FACTURA, REFRESH INTERFACE
//   }

//   componentDidMount () {
//     databaseRead.getNewNumeroFactura().then((currentNroFactura) => this.setState({currentNroFactura}));
//     databaseRead.getClienteById(1).then((cliente) => this.setState({cliente})); // FIXME: DA WARNING EN REACT. PORQUE?
//     databaseRead.getVendedorById(1).then((vendedor) => this.setState({vendedor})); // FIXME: DA WARNING EN REACT. PORQUE?
//     // TODO: get turno
//     this.codigoInput.current.focus();
//     setTimeout(e => this.addVentaItem('ZH2932030828'), 100);
//     setTimeout(e => this.addVentaItem('5985561826014'), 200);
//     setTimeout(e => this.addVentaItem('4883803077006'), 300);
//     setTimeout(e => this.addVentaItem('4883803077006'), 3000);
//   }

//   getDate () {
//     return dateFormat(new Date(), 'MM/dd/yyyy');
//   }

//   async addItem (event) { // ZH2932030828
//     let boolAdded = await this.addVentaItem(this.state.codigo);
//     this.setState({codigo: ''});
//     this.codigoInput.current.focus();
//     if (boolAdded) {
//       // TODO: USER POSITIVE FEEDBACK. TOAST?
//       var aud = new window.Audio(audioOk);
//       aud.play();
//     } else {
//       errorShakeEffect(this.codigoInput.current);
//       var aud2 = new window.Audio(audioError);
//       aud2.play();
//     }
//   }

//   async addVentaItem (codigo) {
//     let articulo = this.state.dataset.find(e => e.CODIGO === codigo);

//     if (articulo) {
//       articulo.CANTIDAD += 1;
//     } else {
//       if (!codigo) return false;
//       articulo = await databaseRead.getArticuloByCodigo(codigo);
//       if (!articulo) return false;
//       articulo.CANTIDAD = 1;
//       let dataset = [...this.state.dataset, articulo];
//       this.setState({dataset});
//     }

//     this.updateArticulo(articulo, this.state.descuento, this.state.condicionPago);
//     this.setState({});
//     return true;
//   }

//   updateArticulo (articulo, descuento = 0, condicion = 'EFECTIVO') {
//     const tipoPrecio = condicion === 'EFECTIVO' ? 'PRECIO_CONTADO' : 'PRECIO_LISTA';

//     articulo.PRECIO_UNITARIO = articulo[tipoPrecio] * (100 - descuento) / 100;
//     if (articulo.DESCUENTO) { // descuento individual del item
//       articulo.PRECIO_UNITARIO *= (100 - articulo.DESCUENTO) / 100;
//     }
//     articulo.PRECIO_TOTAL = articulo.PRECIO_UNITARIO * articulo.CANTIDAD;
//   }

//   updateAllPrices (descuento, condicion = 'EFECTIVO') {
//     const tipoPrecio = condicion === 'EFECTIVO' ? 'PRECIO_CONTADO' : 'PRECIO_LISTA';
//     this.state.dataset.forEach(articulo => {
//       articulo.PRECIO_UNITARIO = articulo[tipoPrecio] * (100 - descuento) / 100;
//       if (articulo.DESCUENTO) { // descuento individual del item
//         articulo.PRECIO_UNITARIO = articulo.PRECIO_UNITARIO * articulo.DESCUENTO;
//       }
//       articulo.PRECIO_TOTAL = articulo.PRECIO_UNITARIO * articulo.CANTIDAD;
//     });
//   }

//   /*
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

//   getVentaTable () {
//     return this.state.dataset.map(row => {
//       return (
//         <tr key={row.id}>
//           <td>{row.CANTIDAD}</td>
//           <td>{row.CODIGO}</td>
//           <td>{row.DESCRIPCION}</td>
//           <td>{row.PRECIO_UNITARIO}</td>
//           <td>{row.PRECIO_TOTAL}</td>
//           <td>{row.DESCUENTO}</td>
//         </tr>
//       );
//     });
//   }

//   render () {
//     return (
//       <div>
//         <form onSubmit={this.onSubmit} className='venta' id='venta'>
//           <div className='panel'>
//             <Input context='venta' disabled tipo='factura' value={this.state.currentNroFactura} />
//             <Input context='venta' tipo='cliente' value={this.state.cliente.NOMBRE} />
//           </div>
//           <div className='panel'>
//             <div>
//               <label htmlFor='venta-condicion-de-pago'>Condicion de pago</label>
//               <select value={this.state.condicionPago} name='venta-condicion-de-pago' id='venta-condicion-de-pago' onChange={this.handleCondicionPago}>
//                 {Object.keys(condicionesPago).map((condicion, i) => <option key={i} value={condicion}>{condicion}</option>)}
//               </select>
//             </div>
//             <InputText context='venta' tipo='descuento' value={this.state.descuento} onChange={this.handleDescuento} ref={this.descuentoInput} />
//           </div>
//           <div className='panel'>
//             <InputText context='venta' tipo='codigo' value={this.state.codigo} onChange={this.handleCodigo} ref={this.codigoInput} />
//             <button className='codigo-search' onClick={this.addItem}>BUTTON</button>
//           </div>
//           <div className='panel'>
//             <Input context='venta' tipo='observaciones' value={this.state.observaciones} onChange={this.handleObservaciones} />
//           </div>
//           <table id='table'>
//             <thead>
//               <tr>
//                 <th>Cantidad</th>
//                 <th>Codigo</th>
//                 <th>Descripcion</th>
//                 <th>Precio Unitario</th>
//                 <th>Precio Total</th>
//                 <th>Descuento</th>
//               </tr>
//             </thead>
//             <tbody>
//               {this.getVentaTable()}
//             </tbody>
//           </table>
//           <div className='panel'>
//             <Input context='venta' disabled tipo='vendedor' value={this.state.vendedor.NOMBRE} />
//             <Input context='venta' disabled tipo='turno' value={this.state.turno} />
//             <Input context='venta' disabled tipo='fecha' value={this.getDate()} />
//           </div>
//         </form>
//       </div>
//     );
//   }
// }

// ReactDOM.render(<Venta ref={(ventaApp) => { window.ventaApp = ventaApp; }} />, document.getElementById('app'));

// id: 'CANTIDAD',
// id: 'CODIGO',
// id: 'DESCRIPCION',
// id: 'PRECIO_UNITARIO',
// id: 'PRECIO_TOTAL',
// id: 'DESCUENTO',

// updateArticulo(activeCell.item, window.ventaApp.state.descuento, window.ventaApp.state.condicionPago);
