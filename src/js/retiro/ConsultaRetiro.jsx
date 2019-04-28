import React, { useState } from 'react';
import RetiroView from './RetiroView';
import Consulta from '../components/ConsultaTransaccion';
import {getItemById} from '../database/getData';

// id: 'numeroRetiro',
// id: 'fechaHora',
// id: 'vendedor',

export default function ConsultaRetiro (props) {
  const [obj, setObj] = useState({});

  function handleRowSelection (selection) {
    getItemById('RETIRO', selection.numeroRetiro)
      .then(setObj);
  }

  return (
    <Consulta
      tabla={'CONSULTA_RETIROS'}
      handleRowSelection={handleRowSelection}
      headers={['numeroRetiro', 'fechaHora', 'vendedor']}>
      <RetiroView obj={obj} setObj={setObj} />
    </Consulta>
  );
}
