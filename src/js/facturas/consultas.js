import { format as dateFormat } from 'date-fns';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { List } from 'react-virtualized';
import 'react-virtualized/styles.css'; // FIXME: don't use virtualized for now
import * as databaseRead from '../database/getData';
import FacturaView from './FacturaView';

function Consultas () {
  const [objList, setObjList] = useState([]);
  const [obj, setObj] = useState({});

  useEffect(() => { // LOAD TABLE
    databaseRead.getAllFacturas()
      .then(res => setObjList(res));
  }, []);

  function rowRenderer ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style // Style object to be applied to row (to position it)
  }) {
    return (
      <div
        className='list-row'
        key={key}
        style={style}
        onClick={event => setObj(objList[index])}
      >
        {`${objList[index].NUMERO_FACTURA}-${dateFormat(new Date(objList[index].FECHA_HORA), 'MM/dd/yyyy')}`}
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='sidebar'>
        <List
          width={300}
          height={300}
          rowCount={objList.length}
          rowHeight={40}
          rowRenderer={rowRenderer}
        />
      </div>
      <main className='main'>
        <FacturaView obj={obj} setObj={setObj} />
      </main>
    </div>
  );
}

// Render your list
ReactDOM.render(
  <Consultas />,
  document.getElementById('root')
);
