import React from 'react';
import dialogs from '../utilities/dialogs';

export default function ItemCompra ({articulo, dispatchCompra}) {
  const removeItem = () => {
    dialogs.confirm(
      confirmed => confirmed && dispatchCompra({type: 'removeItem', payload: articulo}),
      'Eliminar Item?', // Message text
      'CONFIRMAR', // Confirm text
      'VOLVER' // Cancel text
    );
  };

  const cantidadHandler = event => {
    if (parseInt(event.target.value) === 0) {
      removeItem();
    } else {
      dispatchCompra({type: 'setCantidadIndividual', payload: {articulo, value: event.target.value}});
    }
  };

  return (
    <tr>
      <td className='table-cell-cantidad'><input type='number' value={articulo.CANTIDAD} min='0' onChange={cantidadHandler} /></td>
      <td className='table-cell-codigo'>{articulo.CODIGO}</td>
      <td className='table-cell-descripcion'>{articulo.DESCRIPCION}</td>
      <td className='table-cell-stock'>{articulo.STOCK}</td>
      <td className='table-cell-stock'>{articulo.STOCK + articulo.CANTIDAD}</td>
    </tr>
  );
}
