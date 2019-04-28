import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {getTable} from '../database/getData';

export default function Consulta ({tabla, handleRowSelection, children, columns}) {
  const [data, setData] = useState([]);
  useEffect(() => { // LOAD TABLE
    getTable(tabla)
      .then(setData);
  }, []);

  function getTdProps (state, rowInfo, column, instance) {
    return {
      onClick: (e, handleOriginal) => {
        if (rowInfo) handleRowSelection(rowInfo.original);
        if (handleOriginal) handleOriginal();
      }
    };
  }

  return (
    <div className='container'>
      <div className='consulta-transaccion-sidebar' >
        <ReactTable
          data={data}
          filterable
          columns={columns}
          defaultPageSize={10}
          className='-striped -highlight'
          getTdProps={getTdProps}
        />
      </div>
      <main className='consulta-transaccion-main'>
        {children}
      </main>
    </div>
  );
}
