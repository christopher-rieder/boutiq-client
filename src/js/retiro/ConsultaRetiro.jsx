import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import React, { useState } from 'react';
import {getAllRetiros} from '../database/getData';
import RetiroView from './RetiroView';
import {numberRangeFiltering} from '../utilities/filterFunctions';
import Consulta from '../components/ConsultaTransaccion';

const columns = [
  {
    Header: 'NRO',
    id: 'numeroRetiro',
    width: 60,
    accessor: 'numeroRetiro',
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
    Header: 'VENDEDOR',
    id: 'vendedor',
    width: 200,
    accessor: e => e.vendedor,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['vendedor'] }),
    filterAll: true
  }
];

export default function ConsultaRetiro (props) {
  const [obj, setObj] = useState({});

  return (
    <Consulta getData={getAllRetiros} setObj={setObj} columns={columns}>
      <RetiroView obj={obj} />
    </Consulta>
  );
}
