import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import React, { useState, useEffect } from 'react';
import FacturaView from './FacturaView';
import {numberRangeFiltering} from '../utilities/filterFunctions';
import Consulta from '../components/ConsultaTransaccion';
import {getItemById} from '../database/getData';

const columns = [
  {
    Header: 'NRO',
    id: 'numeroFactura',
    width: 60,
    accessor: 'numeroFactura',
    filterMethod: numberRangeFiltering
  },
  {
    Header: 'FECHA',
    id: 'fechaHora',
    width: 200,
    accessor: e => dateFormat(new Date(e.fechaHora), 'dd/MM/yyyy | HH:mm:ss'),
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['fechaHora'] }),
    filterAll: true
  },
  {
    Header: 'CLIENTE',
    id: 'cliente',
    width: 200,
    accessor: e => e.cliente,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['cliente'] }),
    filterAll: true
  },
  {
    Header: 'VENDEDOR',
    id: 'vendedor',
    width: 200,
    accessor: e => e.vendedor,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['vendedor'] }),
    filterAll: true
  }
];

export default function ConsultaFactura () {
  const [obj, setObj] = useState({});

  function handleRowSelection (selection) {
    getItemById('FACTURA', selection.numeroFactura)
      .then(setObj);
    console.log(selection);
  }
  return (
    <Consulta tabla={'CONSULTA_FACTURAS'} handleRowSelection={handleRowSelection} columns={columns}>
      <FacturaView obj={obj} setObj={setObj} />
    </Consulta>
  );
}
