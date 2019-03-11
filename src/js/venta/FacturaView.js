import { format as dateFormat } from 'date-fns';
import React from 'react';
import Pago from '../pagos/Pago';

export default function FacturaView ({obj, setObj}) {
  if (!obj.NUMERO_FACTURA) {
    return <div />;
  } else {
    return (
      <div className='factura__container'>
        <header className='factura__header'>
          <h2 className='factura__header__heading'>
           FACTURA
          </h2>
        </header>
        <section className='factura__datos'>
          <p className='factura__datos__numero_factura'>
            N° de Factura: {obj.NUMERO_FACTURA}
          </p>
          <p className='factura__datos__fecha'>
            Fecha: {dateFormat(new Date(obj.FECHA_HORA), 'dd/MM/yyyy | HH:mm:ss')}
          </p>
          <p className='factura__datos__cliente'>
            Cliente: {obj.CLIENTE.NOMBRE}
          </p>
          <p className='factura__datos__vendedor'>
            Vendedor: {obj.VENDEDOR.NOMBRE}
          </p>
          <p className='factura__datos__descuento'>
            Descuento: {obj.DESCUENTO}
          </p>
          <p className='factura__datos__observaciones'>
            Observaciones: {obj.OBSERVACIONES}
          </p>
        </section>
        <section className='factura__items'>
          <table className='factura__tabla'>
            <thead>
              <tr>
                <th>CODIGO</th>
                <th>DESCRIPCION</th>
                <th>CANT</th>
                <th>PRECIO</th>
                <th>TOTAL</th>
                <th>DESC</th>
              </tr>
            </thead>
            <tbody>
              {obj.ITEMS.map(item => (
                <tr key={item.CODIGO}>
                  <td>{item.CODIGO}</td>
                  <td>{item.DESCRIPCION}</td>
                  <td>{item.CANTIDAD}</td>
                  <td>{item.PRECIO_UNITARIO}</td>
                  <td>{item.PRECIO_TOTAL}</td>
                  <td>{item.DESCUENTO_ITEM}</td>
                </tr>)
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan='3' />
                <th>TOTAL: </th>
                <th>{obj.ITEMS.reduce((suma, item) => suma + item.PRECIO_TOTAL, 0)}</th>
              </tr>
            </tfoot>
          </table>
        </section>
        {obj.PAGOS.length > 0 &&
        <section className='factura__pagos'>
          {obj.PAGOS.map(pago => <Pago key={pago.id + '_' + pago.TIPO_PAGO.id + '_' + pago.ESTADO.id} pago={pago} />)}
        </section>
        }
      </div>
    );
  }
}
