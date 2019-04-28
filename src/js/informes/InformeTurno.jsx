import React, { useState, useEffect } from 'react';
import {getResumenTurno} from '../database/getData';

function InformeTurno ({idTurnoActual}) {
  const [data, setData] = useState({items: []});

  useEffect(() => {
    getResumenTurno(idTurnoActual)
      .then(setData);
  }, []);

  return (
    <div className='informe-turno'>
      <table id='table'>
        <thead>
          <tr>
            <th>Documento</th>
            <th className='table-header-descripcion'>Descripcion</th>
            <th>Cant</th>
            <th className='table-header-valor'>Valor</th>
          </tr>
        </thead>
        <tbody id='tbody'>
          {data.items.map((item, i) => <ItemTurno key={i} item={item} />)}
        </tbody>
      </table>
    </div>
  );
}

function ItemTurno ({item}) {
  return (
    <tr className='tabla-transaccion-row'>
      <td className='tabla-transaccion-cell tabla-transaccion-documento'>{item.documento}</td>
      <td className='tabla-transaccion-cell tabla-transaccion-descripcion'>{item.descripcion}</td>
      <td className='tabla-transaccion-cell tabla-transaccion-cantidad'>{item.cantidad}</td>
      <td className='tabla-transaccion-cell tabla-transaccion-valor'>{item.valor}</td>
    </tr>
  );
}

export default InformeTurno;
