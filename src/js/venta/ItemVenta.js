import React from 'react';
import { money } from '../utilities/format';
import dialogs from '../utilities/dialogs';

export default function ItemVenta ({articulo, dispatchFactura}) {
  const removeItem = () => {
    dialogs.confirm(
      confirmed => confirmed && dispatchFactura({type: 'removeItem', payload: articulo}),
      'Eliminar Item?', // Message text
      'CONFIRMAR', // Confirm text
      'VOLVER' // Cancel text
    );
  };

  const cantidadHandler = event => {
    if (parseInt(event.target.value) === 0) {
      removeItem();
    } else {
      dispatchFactura({type: 'setCantidadIndividual', payload: {articulo, value: event.target.value}});
    }
  };

  const precioHandler = event => {
    dispatchFactura({type: 'setPrecioIndividual', payload: {articulo, value: event.target.value}});
  };

  const descuentoHandler = event => {
    dispatchFactura({type: 'setDescuentoIndividual', payload: {articulo, value: event.target.value}});
  };

  return (
    <tr>
      <td className='table-cell-cantidad'><input type='number' value={articulo.CANTIDAD} min='0' onChange={cantidadHandler} /></td>
      <td className='table-cell-codigo'>{articulo.CODIGO}</td>
      <td className='table-cell-descripcion'>{articulo.DESCRIPCION}</td>
      <td className='table-cell-stock'>{articulo.STOCK}</td>
      <td className='table-cell-precioBase'>{money(articulo.PRECIO_BASE)}</td>
      <td className='table-cell-precioUnitario'><input type='number' value={articulo.PRECIO_UNITARIO} min='0' onChange={precioHandler} /></td>
      <td className='table-cell-precioTotal'>{money(articulo.PRECIO_UNITARIO * articulo.CANTIDAD)}</td>
      <td className='table-cell-descuentoIndividual'><input type='number' value={articulo.DESCUENTO} min='0' onChange={descuentoHandler} /></td>
    </tr>
  );
}
