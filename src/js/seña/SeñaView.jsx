import { format as dateFormat } from 'date-fns';
import React from 'react';

export default function SeñaView ({obj, setObj}) {
  if (!obj.numeroSeña) {
    return <div />;
  } else {
    return (
      <div className='seña-view__container'>
        <section className='seña-view__detalles'>
          <p className='tabla-view__detalle tabla-view__numero'>
            N° de Seña: {obj.numeroSeña}
          </p>
          <p className='tabla-view__detalle tabla-view__fecha'>
            Fecha: {dateFormat(new Date(obj.fechaHora), 'dd/MM/yyyy | HH:mm:ss')}
          </p>
          <p className='tabla-view__detalle tabla-view__vendedor'>
            Vendedor: {obj.vendedor}
          </p>
          <p className='tabla-view__detalle tabla-view__monto'>
            Monto: {obj.monto}
          </p>
          <p className='tabla-view__detalle tabla-view__observaciones'>
            Observaciones: {obj.observaciones}
          </p>
        </section>
        <section className='seña-view__items'>
          <table className='tabla-view__tabla'>
            <thead className='tabla-view__tabla-head'>
              <tr className='tabla-view__tabla-head-row'>
                <th className='tabla-view__tabla-head-cell'>CODIGO</th>
                <th className='tabla-view__tabla-head-cell'>DESCRIPCION</th>
                <th className='tabla-view__tabla-head-cell'>CANT</th>
                <th className='tabla-view__tabla-head-cell'>PRECIO LISTA</th>
                <th className='tabla-view__tabla-head-cell'>PRECIO SEÑA</th>
                <th className='tabla-view__tabla-head-cell'>PRECIO TOTAL</th>
              </tr>
            </thead>
            <tbody className='tabla-view__tabla-body'>
              {obj.items.map(item => (
                <tr key={item.codigo}>
                  <td className='tabla-view__tabla-body-cell'>{item.codigo}</td>
                  <td className='tabla-view__tabla-body-cell'>{item.descripcion}</td>
                  <td className='tabla-view__tabla-body-cell'>{item.cantidad}</td>
                  <td className='tabla-view__tabla-body-cell'>{item.precioLista}</td>
                  <td className='tabla-view__tabla-body-cell'>{item.precioUnitarioSeña}</td>
                  <td className='tabla-view__tabla-body-cell'>{item.precioUnitarioSeña * item.cantidad}</td>
                </tr>)
              )}
            </tbody>
            <tfoot className='tabla-view__tabla-foot'>
              <tr className='tabla-view__tabla-foot-row'>
                <th className='tabla-view__tabla-foot-cell' colSpan='3' />
                <th className='tabla-view__tabla-foot-cell'>TOTAL: </th>
                <th className='tabla-view__tabla-foot-cell'>{obj.items.reduce((suma, item) => suma + item.precioUnitarioSeña * item.cantidad, 0)}</th>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    );
  }
}
