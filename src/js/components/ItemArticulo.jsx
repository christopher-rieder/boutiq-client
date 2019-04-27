import React from 'react';
import dialogs from '../utilities/dialogs';
import { money } from '../utilities/format';

export default function ItemArticulo ({articulo, setDescuentoIndividual, setPrecioIndividual, setCantidadIndividual, removeItem}) {
  const {añadeStock, removeStock, cantidad, codigo, descripcion, stock, precioBase, precioCosto, precioUnitario, descuento} = articulo;

  const handleRemoveItem = () => {
    dialogs.confirm(
      confirmed => confirmed && removeItem(),
      'Eliminar Item?', // Message text
      'CONFIRMAR', // Confirm text
      'VOLVER' // Cancel text
    );
  };

  const cantidadHandler = event => {
    if (parseInt(event.target.value) === 0) {
      handleRemoveItem();
    } else {
      setCantidadIndividual(event);
    }
  };

  return (
    <tr className='tabla-transaccion-row'>
      <td className='tabla-transaccion-cell tabla-transaccion-cantidad'>
        <input type='number' value={cantidad} min='0' onChange={cantidadHandler} />
      </td>
      <td className='tabla-transaccion-cell tabla-transaccion-codigo'>{codigo}</td>
      <td className='tabla-transaccion-cell tabla-transaccion-descripcion'>{descripcion}</td>
      <td className='tabla-transaccion-cell tabla-transaccion-stock'>{stock}</td>

      {añadeStock === true && <td className='tabla-transaccion-cell tabla-transaccion-stockNuevo'>{stock + cantidad}</td>}
      {removeStock === true && <td className='tabla-transaccion-cell tabla-transaccion-stockNuevo'>{stock - cantidad}</td>}

      {precioBase && <td className='tabla-transaccion-cell tabla-transaccion-precioBase'>{money(precioBase)}</td>}
      {precioCosto && <td className='tabla-transaccion-cell tabla-transaccion-precioCosto'>{money(precioCosto)}</td>}

      {precioUnitario &&
      <td className='tabla-transaccion-cell tabla-transaccion-precioUnitario'>
        <input type='number' value={precioUnitario} min='0' onChange={setPrecioIndividual} />
      </td>}

      {precioUnitario && <td className='tabla-transaccion-cell tabla-transaccion-precioTotal'>{money(precioUnitario * cantidad)}</td>}

      {(descuento || descuento === 0) &&
      <td className='tabla-transaccion-cell tabla-transaccion-descuentoIndividual'>
        <input type='number' value={descuento} min='0' onChange={setDescuentoIndividual} />
      </td>}

    </tr>
  );
}
