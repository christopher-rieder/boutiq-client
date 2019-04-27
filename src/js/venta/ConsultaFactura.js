import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import React, { useState } from 'react';
import {getAllFacturas} from '../database/getData';
import FacturaView from './FacturaView';
import {numberRangeFiltering} from '../utilities/filterFunctions';
import Consulta from '../components/ConsultaTransaccion';

const columns = [
  {
    Header: 'NRO',
    id: 'NUMERO_FACTURA',
    width: 60,
    accessor: 'NUMERO_FACTURA',
    filterMethod: numberRangeFiltering
  },
  {
    Header: 'FECHA',
    id: 'FECHA_HORA',
    width: 200,
    accessor: e => dateFormat(new Date(e.FECHA_HORA), 'dd/MM/yyyy | HH:mm:ss'),
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['FECHA_HORA'] }),
    filterAll: true
  },
  {
    Header: 'CLIENTE',
    id: 'CLIENTE',
    width: 200,
    accessor: e => e.CLIENTE.NOMBRE,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['CLIENTE'] }),
    filterAll: true
  },
  {
    Header: 'VENDEDOR',
    id: 'VENDEDOR',
    width: 200,
    accessor: e => e.VENDEDOR.NOMBRE,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['VENDEDOR'] }),
    filterAll: true
  }
];

export default function ConsultaFactura () {
  const [obj, setObj] = useState({});
  return (
    <Consulta getData={getAllFacturas} setObj={setObj} columns={columns}>
      <FacturaView obj={obj} />
    </Consulta>
  );
}
