import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState } from 'react';
import audioError from '../../resources/audio/error.wav';
import audioOk from '../../resources/audio/ok.wav';
import { InputTextField, InputSelect, useFormInput, useFormInputFloat } from '../components/inputs';
import Modal from '../components/modal';
import { descuentoMax } from '../constants/bussinessConstants';
import Consulta from '../crud/consulta';
import ConsultaArticulo from '../crud/consultaArticulo';
import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import dialogs from '../utilities/dialogs';
import { money } from '../utilities/format';
import { round } from '../utilities/math';
import ItemVenta from './ItemVenta';
import './venta.css';

export default function Venta (props) {
  const descuento = useFormInputFloat(0, descuentoMax);
  const [numeroFactura, setNumeroFactura] = useState(0);
  const [cliente, setCliente] = useState({id: 0, NOMBRE: ''});
  const [vendedor, setVendedor] = useState({id: 0, NOMBRE: ''});
  const [turno, setTurno] = useState({id: 0});
  const [tipoPago, setTipoPago] = useState({id: 1, NOMBRE: 'EFECTIVO'});
  const [items, setItems] = useState([]);
  const [codigo, setCodigo] = useState('');
  const observaciones = useFormInput('');
  const [displayModal, setDisplayModal] = useState(false);
  const [modalContent, setModalContent] = useState(<ConsultaArticulo />);

  useEffect(() => {
    databaseRead.getLastNumeroFactura().then(res => setNumeroFactura(res.lastId + 1));
    databaseRead.getClienteById(1).then(res => setCliente(res));
    databaseRead.getVendedorById(1).then(res => setVendedor(res));
    databaseRead.getTurnoActual().then(res => setTurno(res));
    descuento.setValue(0);
    setItems([]);
    observaciones.setValue('');
  }, [numeroFactura]);

  const getTotal = () => items.reduce((total, articulo) => {
    const precioBase = articulo[tipoPago.id === 1 ? 'PRECIO_CONTADO' : 'PRECIO_LISTA'];
    const precioUnitario = articulo.PRECIO_CUSTOM || round(precioBase * (1 - descuento.value / 100) * (1 - articulo.DESCUENTO / 100));
    const precioTotal = precioUnitario * articulo.CANTIDAD;
    return total + precioTotal;
  }, 0);

  const addVentaHandler = (event) => {
    if (!codigo) return false;
    if (event.which !== 13) return false;
    addVentaItem();
  };

  const addVentaItem = (data) => {
    const cod = data ? data.CODIGO : codigo;
    const articulo = items.find(item => item.CODIGO === cod);
    if (articulo) {
      setItems(items.map(item => item.CODIGO === codigo ? {...item, CANTIDAD: item.CANTIDAD + 1} : item));
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
        DESCUENTO: descuento.value,
        OBSERVACIONES: observaciones.value,
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

  // // function addPago () {
  // //   // TODO: add pagos
  // //   // TODO: VALIDATIONS
  // // }

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
        handleSelection={obj => setCliente(obj)} />
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
        <InputTextField name='Factura' value={numeroFactura} readOnly />
        <InputTextField name='Cliente' value={cliente.NOMBRE} readOnly onClick={clienteModal} />
      </div>
      <div className='panel'>
        <InputSelect table='TIPO_PAGO' name='Tipos de pago' accessor='NOMBRE' value={tipoPago} setValue={setTipoPago} />
        <InputTextField name='Descuento' {...descuento} autoComplete='off' />
      </div>
      <div className='panel'>
        <InputTextField name='Codigo' value={codigo} autoFocus autoComplete='off' onKeyPress={addVentaHandler} onChange={event => setCodigo(event.target.value)} />
        <button className='codigo-search' onClick={handleSubmit}>BUTTON</button>
        <button className='codigo-search' onClick={articuloModal}>MODAL</button>
      </div>
      <div className='panel'>
        <InputTextField name='Observaciones' {...observaciones} />
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
            descuento={descuento.value} />)}
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
