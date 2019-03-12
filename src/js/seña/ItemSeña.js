import React from 'react';
import dialogs from '../utilities/dialogs';

export default function ItemSeña ({articulo, dispatch}) {
  const removeItem = () => {
    dialogs.confirm(
      confirmed => confirmed && dispatch({type: 'removeItem', payload: articulo}),
      'Eliminar Item?', // Message text
      'CONFIRMAR', // Confirm text
      'VOLVER' // Cancel text
    );
  };

  const cantidadHandler = event => {
    if (parseInt(event.target.value) === 0) {
      removeItem();
    } else {
      dispatch({type: 'setCantidadIndividual', payload: {articulo, value: event.target.value}});
    }
  };

  return (
    <tr>
      <td className='table-cell-cantidad'><input type='number' value={articulo.CANTIDAD} min='0' onChange={cantidadHandler} /></td>
      <td className='table-cell-codigo'>{articulo.CODIGO}</td>
      <td className='table-cell-descripcion'>{articulo.DESCRIPCION}</td>
    </tr>
  );
}
