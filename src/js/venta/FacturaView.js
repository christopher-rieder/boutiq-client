import { format as dateFormat } from 'date-fns';
import React from 'react';
import Pago from '../pagos/Pago';

export default function FacturaView ({obj, setObj}) {
  if (!obj.numeroFactura) {
    return <div />;
  } else {
    return (
      <div className='factura-view__container'>
        <section className='factura-view__detalles'>
          <p className='tabla-view__detalle tabla-view__numero'>
            N° de Factura: {obj.numeroFactura}
          </p>
          <p className='tabla-view__detalle tabla-view__fecha'>
            Fecha: {dateFormat(new Date(obj.fechaHora), 'dd/MM/yyyy | HH:mm:ss')}
          </p>
          <p className='tabla-view__detalle tabla-view__cliente'>
            Cliente: {obj.cliente}
          </p>
          <p className='tabla-view__detalle tabla-view__vendedor'>
            Vendedor: {obj.vendedor}
          </p>
          <p className='tabla-view__detalle tabla-view__descuento'>
            Descuento: {obj.descuento}
          </p>
          <p className='tabla-view__detalle tabla-view__observaciones'>
            Observaciones: {obj.observaciones}
          </p>
        </section>
        <section className='factura-view__items'>
          <table className='tabla-view__tabla'>
            <thead className='tabla-view__head'>
              <tr className='tabla-view__head-row'>
                <th className='tabla-view__head-cell'>CODIGO</th>
                <th className='tabla-view__head-cell'>DESCRIPCION</th>
                <th className='tabla-view__head-cell'>CANT</th>
                <th className='tabla-view__head-cell'>PRECIO</th>
                <th className='tabla-view__head-cell'>TOTAL</th>
                <th className='tabla-view__head-cell'>DESC</th>
              </tr>
            </thead>
            <tbody className='tabla-view__body'>
              {obj.items.map(item => (
                <tr key={item.codigo} className='tabla-view__body-row' >
                  <td className='tabla-view__body-cell'>{item.codigo}</td>
                  <td className='tabla-view__body-cell'>{item.descripcion}</td>
                  <td className='tabla-view__body-cell'>{item.cantidad}</td>
                  <td className='tabla-view__body-cell'>{item.precioUnitario}</td>
                  <td className='tabla-view__body-cell'>{item.precioTotal}</td>
                  <td className='tabla-view__body-cell'>{item.descuentoItem}</td>
                </tr>)
              )}
            </tbody>
            <tfoot className='tabla-view__foot'>
              <tr className='tabla-view__foot-row'>
                <th className='tabla-view__foot-cell' colSpan='3' />
                <th className='tabla-view__foot-cell'>TOTAL: </th>
                <th className='tabla-view__foot-cell'>{obj.items.reduce((suma, item) => suma + item.precioTotal, 0)}</th>
              </tr>
            </tfoot>
          </table>
        </section>
        {obj.pagos.length > 0 &&
        <section className='factura-view__pagos'>
          {obj.pagos.map(pago => <Pago key={pago.id + '_' + pago.tipoPago.id + '_' + pago.estado.id} pago={pago} />)}
        </section>
        }
      </div>
    );
  }
}
