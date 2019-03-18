import React, { useState, useContext } from 'react';
import { InputTextField, InputFloatField } from '../components/inputs';

export default function AgregarSeña (props) {
  // TODO: AGREGAR OBSERVACIONES A SEÑA EN LA BASE DE DATOS
  // permitir seleccionar seña mostrar todos los datos para seleccion
  // para callback handler enviar:
  // numero_seña, monto, cliente_id, fecha_hora, observaciones
  // [item_seña] ->articulo_id, monto

  // luego en venta procesar la seña
  // agregar los items a items de venta
  // agregar pago, tipo de pago seña, con el monto de la seña
  // agregar en el render() algo para mostrar que se esta saldando esa seña

  return (
    <div>
      <button className='codigo-search' onClick={handleSubmit}>AGREGAR SEÑA</button>
    </div>
  );
}
