import React, { useState } from 'react';
import FacturaView from './FacturaView';
import Consulta from '../components/ConsultaTransaccion';
import {getItemById} from '../database/getData';

export default function ConsultaFactura () {
  const [obj, setObj] = useState({});

  function handleRowSelection (selection) {
    getItemById('FACTURA', selection.numeroFactura)
      .then(setObj);
    console.log(selection);
  }
  return (
    <Consulta
      tabla={'CONSULTA_FACTURAS'}
      handleRowSelection={handleRowSelection}
      headers={['numeroFactura', 'fechaHora', 'cliente', 'vendedor']}>
      <FacturaView obj={obj} setObj={setObj} />
    </Consulta>
  );
}
