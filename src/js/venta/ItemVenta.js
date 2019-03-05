import React from 'react';
import { DESCUENTO_MAX } from '../constants/bussinessConstants';
import { money } from '../utilities/format';
import { round } from '../utilities/math';
import dialogs from '../utilities/dialogs';

export default function ItemVenta ({articulo, tipoPago, descuento, items, setItems}) {
  // TODO: a bit hacky; the Venta class has to observe the changes in PRECIO_UNITARIO
  // but it can only be calculated here in a simple way. so, the Venta state needs observers to every ItemVenta
  articulo.PRECIO_BASE = articulo[tipoPago.id === 1 ? 'PRECIO_CONTADO' : 'PRECIO_LISTA'];
  articulo.PRECIO_UNITARIO = articulo.PRECIO_CUSTOM || round(articulo.PRECIO_BASE * (1 - descuento / 100) * (1 - articulo.DESCUENTO / 100));

  const cantidadHandler = event => {
    const value = event.target.value;
    if (parseInt(value) === 0) { // remove item
      dialogs.confirm(
        confirmed => confirmed && setItems(items.filter(e => e.CODIGO !== articulo.CODIGO)),
        'Eliminar Item?', // Message text
        'CONFIRMAR', // Confirm text
        'VOLVER' // Cancel text
      );
    }
    let newCantidad = isNaN(parseInt(value)) ? 1 : value > 0 ? parseInt(value) : 1;
    setItems(items.map(item => item.CODIGO === articulo.CODIGO ? {...item, CANTIDAD: newCantidad} : item));
  };

  const precioHandler = event => {
    const parsedValue = parseFloat(event.target.value);
    const newPrecio = isNaN(parsedValue)
      ? round(articulo.PRECIO_BASE * (1 - DESCUENTO_MAX / 100))
      : parsedValue;
    const newDescuento = round(100 - (newPrecio / articulo.PRECIO_BASE * (1 - descuento / 100)) * 100);
    setItems(items.map(item => item.CODIGO === articulo.CODIGO ? {...item, DESCUENTO: newDescuento, PRECIO_CUSTOM: newPrecio, PRECIO_UNITARIO: newPrecio} : item));
  };

  const descuentoHandler = event => {
    const newDescuento = isNaN(parseFloat(event.target.value)) ? 0 : parseFloat(event.target.value);
    setItems(items.map(item => item.CODIGO === articulo.CODIGO ? {...item, DESCUENTO: newDescuento, PRECIO_CUSTOM: undefined} : item));
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
      <td className='table-cell-descuentoIndividual'><input type='number' value={articulo.DESCUENTO} min='0' max={DESCUENTO_MAX} onChange={descuentoHandler} /></td>
    </tr>
  );
}
