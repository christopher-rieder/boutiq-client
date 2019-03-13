import { format as dateFormat } from 'date-fns';
import React from 'react';

export default function RetiroView ({obj, setObj}) {
  if (!obj.NUMERO_RETIRO) {
    return <div />;
  } else {
    return (
      <div className='retiro-view__container'>
        <section className='retiro-view__detalles'>
          <p className='tabla-view__detalle tabla-view__numero'>
            N° de Retiro: {obj.NUMERO_RETIRO}
          </p>
          <p className='tabla-view__detalle tabla-view__fecha'>
            Fecha: {dateFormat(new Date(obj.FECHA_HORA), 'dd/MM/yyyy | HH:mm:ss')}
          </p>
          <p className='tabla-view__detalle tabla-view__vendedor'>
            Vendedor: {obj.VENDEDOR.NOMBRE}
          </p>
          <p className='tabla-view__detalle tabla-view__observaciones'>
            Observaciones: {obj.OBSERVACIONES}
          </p>
        </section>
        <section className='retiro-view__items'>
          <table className='tabla-view__tabla'>
            <thead className='tabla-view__tabla-head'>
              <tr className='tabla-view__tabla-head-row'>
                <th className='tabla-view__tabla-head-cell'>CODIGO</th>
                <th className='tabla-view__tabla-head-cell'>DESCRIPCION</th>
                <th className='tabla-view__tabla-head-cell'>CANT</th>
              </tr>
            </thead>
            <tbody className='tabla-view__tabla-body'>
              {obj.ITEMS.map(item => (
                <tr key={item.CODIGO}>
                  <td className='tabla-view__tabla-body-cell'>{item.CODIGO}</td>
                  <td className='tabla-view__tabla-body-cell'>{item.DESCRIPCION}</td>
                  <td className='tabla-view__tabla-body-cell'>{item.CANTIDAD}</td>
                </tr>)
              )}
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}
