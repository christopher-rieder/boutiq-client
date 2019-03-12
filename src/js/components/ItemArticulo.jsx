import React from 'react';
import dialogs from '../utilities/dialogs';
import { money } from '../utilities/format';

export default function ItemArticulo ({articulo, dispatch}) {
  const {AÑADE_STOCK, REMOVE_STOCK, CANTIDAD, CODIGO, DESCRIPCION, STOCK, PRECIO_BASE, PRECIO_COSTO, PRECIO_UNITARIO, DESCUENTO} = articulo;

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

  const precioHandler = event => {
    dispatch({type: 'setPrecioIndividual', payload: {articulo, value: event.target.value}});
  };

  const descuentoHandler = event => {
    dispatch({type: 'setDescuentoIndividual', payload: {articulo, value: event.target.value}});
  };

  return (
    <tr className='tabla-transaccion-row'>
      <td className='tabla-transaccion-cell tabla-transaccion-cantidad'>
        <input type='number' value={CANTIDAD} min='0' onChange={cantidadHandler} />
      </td>
      <td className='tabla-transaccion-cell tabla-transaccion-codigo'>{CODIGO}</td>
      <td className='tabla-transaccion-cell tabla-transaccion-descripcion'>{DESCRIPCION}</td>
      <td className='tabla-transaccion-cell tabla-transaccion-stock'>{STOCK}</td>

      {AÑADE_STOCK === true && <td className='tabla-transaccion-cell tabla-transaccion-stock'>{STOCK + CANTIDAD}</td>}
      {REMOVE_STOCK === true && <td className='tabla-transaccion-cell tabla-transaccion-stock'>{STOCK - CANTIDAD}</td>}

      {PRECIO_BASE && <td className='tabla-transaccion-cell tabla-transaccion-precioBase'>{money(PRECIO_BASE)}</td>}
      {PRECIO_COSTO && <td className='tabla-transaccion-cell tabla-transaccion-precioCosto'>{money(PRECIO_COSTO)}</td>}

      {PRECIO_UNITARIO &&
      <td className='tabla-transaccion-cell tabla-transaccion-precioUnitario'>
        <input type='number' value={PRECIO_UNITARIO} min='0' onChange={precioHandler} />
      </td>}

      {PRECIO_UNITARIO && <td className='tabla-transaccion-cell tabla-transaccion-precioTotal'>{money(PRECIO_UNITARIO * CANTIDAD)}</td>}

      {(DESCUENTO || DESCUENTO === 0) &&
      <td className='tabla-transaccion-cell tabla-transaccion-descuentoIndividual'>
        <input type='number' value={DESCUENTO} min='0' onChange={descuentoHandler} />
      </td>}

    </tr>
  );
}
