import { format as dateFormat } from 'date-fns';
import React from 'react';

export default function CompraView ({obj, setObj}) {
  if (!obj.NUMERO_COMPRA) {
    return <div />;
  } else {
    return (
      <div className='compra__container'>
        <header className='compra__header'>
          <h2 className='compra__header__heading'>
           COMPRA
          </h2>
        </header>
        <section className='compra__datos'>
          <p className='compra__datos__numero_compra'>
            N° de Compra: {obj.NUMERO_COMPRA}
          </p>
          <p className='compra__datos__fecha'>
            Fecha: {dateFormat(new Date(obj.FECHA_HORA), 'dd/MM/yyyy | HH:mm:ss')}
          </p>
          <p className='compra__datos__cliente'>
            Proveedor: {obj.PROVEEDOR.NOMBRE}
          </p>
          <p className='compra__datos__observaciones'>
            Observaciones: {obj.OBSERVACIONES}
          </p>
        </section>
        <section className='compra__items'>
          <table className='compra__tabla'>
            <thead>
              <tr>
                <th>CODIGO</th>
                <th>DESCRIPCION</th>
                <th>CANT</th>
              </tr>
            </thead>
            <tbody>
              {obj.ITEMS.map(item => (
                <tr key={item.CODIGO}>
                  <td>{item.CODIGO}</td>
                  <td>{item.DESCRIPCION}</td>
                  <td>{item.CANTIDAD}</td>
                </tr>)
              )}
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}
