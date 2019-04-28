import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {getTable} from '../database/getData';
import reactTableColumns from './reactTableColumns';

// tabla pueden ser views de la base de datos tambien
// handleRowSelection tiene que ser definido en el componente padre
// es un callback que va a mandar la fila seleccionada como parametro
// headers puede o no estar definido. si no esta definido, saca los headers
// con Object.keys al primer elemento de los datos
// definicion de headers de columnas en reactTableColumns.js
export default function Consulta ({tabla, headers, handleRowSelection, children}) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => { // LOAD TABLE
    getTable(tabla)
      .then(res => {
        const columnHeaders = headers || Object.keys(res[0]);
        // interseccion de conjunto entre las columnas proporcionadas u obtenidas y
        // las columnas definidas en reactTableColumns, en base a id
        // en la definicion de columnas 'id' es el nombre de los distintos campos
        // de las tablas. por ejemplo, numeroFactura, precioUnitario, descripcion, ...
        setColumns(reactTableColumns.filter(row => columnHeaders.some(key => row.id === key)));
        setData(res);
      });
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
