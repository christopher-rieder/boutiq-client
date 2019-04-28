import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import React, { useState } from 'react';
import {getAllCompras} from '../database/getData';
import CompraView from './CompraView';
import {numberRangeFiltering} from '../utilities/filterFunctions';
import Consulta from '../components/ConsultaTransaccion';

const columns = [
  {
    Header: 'NRO',
    id: 'numeroCompra',
    width: 60,
    accessor: 'numeroCompra',
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
    Header: 'PROVEEDOR',
    id: 'proveedor',
    width: 200,
    accessor: 'proveedor',
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['proveedor'] }),
    filterAll: true
  }
];

export default function ConsultaCompra () {
  const [obj, setObj] = useState({});

  return (
    <Consulta getData={getAllCompras} setObj={setObj} columns={columns}>
      <CompraView obj={obj} />
    </Consulta>
  );
}
