import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {getAllRetiros} from '../database/getData';
import RetiroView from './RetiroView';
import {numberRangeFiltering} from '../utilities/filterFunctions';

const columns = [
  {
    Header: 'NRO',
    id: 'NUMERO_RETIRO',
    width: 60,
    accessor: 'NUMERO_RETIRO',
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
    Header: 'VENDEDOR',
    id: 'VENDEDOR',
    width: 200,
    accessor: e => e.VENDEDOR.NOMBRE,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['VENDEDOR'] }),
    filterAll: true
  }
];

export default function ConsultaRetiro (props) {
  const [data, setData] = useState([]);

  const [obj, setObj] = useState({});

  useEffect(() => { // LOAD TABLE
    getAllRetiros()
      .then(res => setData(res));
  }, []);

  function getTdProps (state, rowInfo, column, instance) {
    return {
      onClick: (e, handleOriginal) => {
        if (rowInfo) setObj(rowInfo.original);
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
          columns={columns}
          defaultPageSize={20}
          className='-striped -highlight'
          getTdProps={getTdProps}
        />
      </div>
      <main className='main'>
        <RetiroView obj={obj} setObj={setObj} />
      </main>
    </div>
  );
}
