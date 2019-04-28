import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SeñaView from './SeñaView';
import {numberRangeFiltering} from '../utilities/filterFunctions';
import { getAllSeñas } from '../database/getData';

const columns = [
  {
    Header: 'NRO',
    id: 'numeroSeña',
    width: 60,
    accessor: 'numeroSeña',
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
    Header: 'MONTO',
    id: 'monto',
    width: 200,
    accessor: 'monto',
    filterMethod: numberRangeFiltering
  },
  {
    Header: 'ESTADO',
    id: 'estado',
    width: 200,
    accessor: e => e.estado,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['estado'] }),
    filterAll: true
  }
];

export default function ConsultaSeña (props) {
  const [data, setData] = useState([]);
  const [obj, setObj] = useState('');

  useEffect(() => {
    getAllSeñas()
      .then(res => setData(res));
  }, []);

  function getTdProps (state, rowInfo, column, instance) {
    return {
      onClick: (e, handleOriginal) => {
        if (rowInfo) {
          setObj(rowInfo.original);
        }
        if (handleOriginal) handleOriginal();
      }
    };
  }

  return (
    <div className='container'>
      <div className='sidebar'>
        <ReactTable
          data={data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          columns={columns}
          defaultPageSize={12}
          className='-striped -highlight'
          getTdProps={getTdProps}
        />
      </div>
      <main className='main'>
        {obj !== '' && <SeñaView {...{obj, setObj}} />}
      </main>
    </div>
  );
}
