import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {InputSearch, InputFactory} from '../components/inputs';
import filterFunctions from '../utilities/filterFunctions';

const textFilter = filterFunctions.wordFiltering(true);
const cols = {
  marca: ['id', 'NOMBRE'],
  rubro: ['id', 'NOMBRE'],
  proveedor: ['id', 'NOMBRE'],
  tipo_pago: ['id', 'NOMBRE'],
  vendedor: ['id', 'NOMBRE']
};
const coltypes = ['id', 'text'];

function App () {
  const [search, setSearch] = useState('');
  const [objList, setObjList] = useState([]);
  const [obj, setObj] = useState({});
  const [table, setTable] = useState('marca');
  const filterCol = 'NOMBRE';

  useEffect(() => { // LOAD TABLE
    console.log(table);

    databaseRead.getTable(table)
      .then(res => setObjList(res))
      .catch(err => alert(err));
  }, [table]);

  const submitHandler = event => {
    const index = objList.findIndex(e => e.id === obj.id);
    setObjList([...objList.slice(0, index), obj, ...objList.slice(index + 1)]);
    console.log(obj);
    databaseWrite.postObjectToAPI(obj, table);
    document.querySelector('#crud-id-' + obj.id).classList.add('crud-list-item-highlight');
    setTimeout(() => document.querySelector('#crud-id-' + obj.id).classList.remove('crud-list-item-highlight'), 1000);
  };
  const liClickHandler = event => {
    const id = parseInt(event.target.dataset.id);
    if (id) {
      setObj(objList.find(element => element.id === id));
    }
  };

  const list = () => objList
    .filter(element => textFilter(element[filterCol], search))
    .map(element => (
      <li className='crud-list-item'
        id={'crud-id-' + element.id}
        data-id={element.id}
        key={element.id}>{element[filterCol]}</li>)
    );

  const inputs = () => cols[table]
    .map((col, i) => InputFactory(col, coltypes[i], table, obj[col], event => setObj({...obj, [col]: event.target.value})));

  return (
    <div className='main-container'>
      <div className='sidebar'>
        <select onChange={event => setTable(event.target.value)}>
          <option>marca</option>
          <option>rubro</option>
          <option>proveedor</option>
          <option>tipo_pago</option>
          <option>vendedor</option>
        </select>
        <InputSearch value={search} onChange={event => setSearch(event.target.value)} />
        <ul id={'lista' + table} className='crud-list' onClick={liClickHandler} >
          {list()}
        </ul>
      </div>
      <div className='crud-main'>
        <div className='crud-inputs'>
          {inputs()}
          <button onClick={submitHandler}>BOTON</button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
