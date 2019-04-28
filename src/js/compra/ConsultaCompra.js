import React, { useState } from 'react';
import CompraView from './CompraView';
import Consulta from '../components/ConsultaTransaccion';
import {getItemById} from '../database/getData';

export default function ConsultaCompra () {
  const [obj, setObj] = useState({});

  function handleRowSelection (selection) {
    getItemById('COMPRA', selection.numeroCompra)
      .then(setObj);
  }

  return (
    <Consulta
      tabla={'CONSULTA_COMPRAS'}
      handleRowSelection={handleRowSelection}
      headers={['numeroCompra', 'fechaHora', 'proveedor', 'vendedor']}>
      <CompraView obj={obj} setObj={setObj} />
    </Consulta>
  );
}
