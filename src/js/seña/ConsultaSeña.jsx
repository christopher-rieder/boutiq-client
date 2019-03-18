import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import React, { useEffect, useState, useContext } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import SeñaView from './SeñaView';
import {numberRangeFiltering} from '../utilities/filterFunctions';
import { getAllSeñas } from '../database/getData';

const columns = [
  {
    Header: 'NRO',
    id: 'NUMERO_SEÑA',
    width: 60,
    accessor: 'NUMERO_SEÑA',
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
    Header: 'MONTO',
    id: 'MONTO',
    width: 200,
    accessor: 'MONTO',
    filterMethod: numberRangeFiltering
  },
  {
    Header: 'ESTADO',
    id: 'ESTADO',
    width: 200,
    accessor: e => e.ESTADO.NOMBRE,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['ESTADO'] }),
    filterAll: true
  }
];

export default function ConsultaSeña (props) {
  const [data, setData] = useState([]);
  // const {tablaEstadoPago} = useContext(MainContext);
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
