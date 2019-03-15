import { format as dateFormat } from 'date-fns';
import React from 'react';

export default function CompraView ({obj, setObj}) {
  if (!obj.NUMERO_COMPRA) {
    return <div />;
  } else {
    return (
      <div className='compra-view__container'>
        <section className='compra-view__detalles'>
          <p className='tabla-view__detalle tabla-view__numero'>
            N° de Compra: {obj.NUMERO_COMPRA}
          </p>
          <p className='tabla-view__detalle tabla-view__fecha'>
            Fecha: {dateFormat(new Date(obj.FECHA_HORA), 'dd/MM/yyyy | HH:mm:ss')}
          </p>
          <p className='tabla-view__detalle tabla-view__cliente'>
            Proveedor: {obj.PROVEEDOR.NOMBRE}
          </p>
          <p className='tabla-view__detalle tabla-view__observaciones'>
            Observaciones: {obj.OBSERVACIONES}
          </p>
        </section>
        <section className='compra-view__items'>
          <table className='tabla-view__tabla'>
            <thead className='tabla-view__head'>
              <tr className='tabla-view__head-row'>
                <th className='tabla-view__head-cell'>CODIGO</th>
                <th className='tabla-view__head-cell'>DESCRIPCION</th>
                <th className='tabla-view__head-cell'>CANT</th>
              </tr>
            </thead>
            <tbody className='tabla-view__body'>
              {obj.ITEMS.map(item => (
                <tr key={item.CODIGO} className='tabla-view__body-row'>
                  <td className='tabla-view__body-cell'>{item.CODIGO}</td>
                  <td className='tabla-view__body-cell'>{item.DESCRIPCION}</td>
                  <td className='tabla-view__body-cell'>{item.CANTIDAD}</td>
                </tr>)
              )}
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}
