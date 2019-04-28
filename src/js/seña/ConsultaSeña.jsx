import React, { useState } from 'react';
import SeñaView from './SeñaView';
import Consulta from '../components/ConsultaTransaccion';
import {getItemById} from '../database/getData';

export default function ConsultaSeña (props) {
  const [obj, setObj] = useState({});

  function handleRowSelection (selection) {
    getItemById('seña', selection.numeroSeña)
      .then(setObj);
  }

  return (
    <Consulta
      tabla={'CONSULTA_SEÑAS'}
      handleRowSelection={handleRowSelection}
      headers={['numeroSeña', 'fechaHora', 'vendedor', 'cliente', 'estado']}>
      <SeñaView obj={obj} setObj={setObj} />
    </Consulta>
  );
}
