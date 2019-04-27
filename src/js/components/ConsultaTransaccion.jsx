import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default function Consulta ({getData, setObj, children, columns}) {
  const [data, setData] = useState([]);
  console.log(JSON.stringify(data));

  useEffect(() => { // LOAD TABLE
    getData()
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
