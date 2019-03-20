import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {getAllFacturas} from '../database/getData';
import FacturaView from './FacturaView';
import {numberRangeFiltering} from '../utilities/filterFunctions';

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

export default function ConsultaFactura (props) {
  const [data, setData] = useState([]);
  const [obj, setObj] = useState({});
  const collapse = {width: '12rem'};

  useEffect(() => { // LOAD TABLE
    getAllFacturas()
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
      <div className='sidebar' style={collapse} >
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
        <FacturaView obj={obj} setObj={setObj} />
      </main>
    </div>
  );
}
