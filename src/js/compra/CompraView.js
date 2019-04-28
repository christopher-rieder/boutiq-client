import { format as dateFormat } from 'date-fns';
import React from 'react';

export default function CompraView ({obj, setObj}) {
  console.log(Object.keys(obj));
  if (!obj.numeroCompra) {
    return <div />;
  } else {
    return (
      <div className='compra-view__container'>
        <section className='compra-view__detalles'>
          <p className='tabla-view__detalle tabla-view__numero'>
            N° de Compra: {obj.numeroCompra}
          </p>
          <p className='tabla-view__detalle tabla-view__fecha'>
            Fecha: {dateFormat(new Date(obj.fechaHora), 'dd/MM/yyyy | HH:mm:ss')}
          </p>
          <p className='tabla-view__detalle tabla-view__cliente'>
            Proveedor: {obj.proveedor}
          </p>
          <p className='tabla-view__detalle tabla-view__observaciones'>
            Observaciones: {obj.observaciones}
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
              {obj.items.map(item => (
                <tr key={item.codigo} className='tabla-view__body-row'>
                  <td className='tabla-view__body-cell'>{item.codigo}</td>
                  <td className='tabla-view__body-cell'>{item.descripcion}</td>
                  <td className='tabla-view__body-cell'>{item.cantidad}</td>
                </tr>)
              )}
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}
