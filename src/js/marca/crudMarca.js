import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {InputText, InputSearch} from '../components/inputs';
import filterFunctions from '../utilities/filterFunctions';

const textFilter = filterFunctions.wordFiltering(true);

function App () {
  const [search, setSearch] = useState('');
  const [marcas, setMarcas] = useState([]);
  const [marca, setMarca] = useState({});

  useEffect(() => { // LOAD TABLE MARCA
    databaseRead.getTable('marca')
      .then(res => setMarcas(res));
  }, []);

  const submitHandler = event => {
    if (event.which === 13) {
      const index = marcas.findIndex(e => e.id === marca.id);
      setMarcas([...marcas.slice(0, index), marca, ...marcas.slice(index + 1)]);
      databaseWrite.postObjectToAPI(marca, 'marca');
      document.querySelector('#crud-id-' + marca.id).classList.add('crud-list-item-highlight');
      setTimeout(() => document.querySelector('#crud-id-' + marca.id).classList.remove('crud-list-item-highlight'), 1000);
    }
  };

  const liClickHandler = event => {
    const id = parseInt(event.target.dataset.id);
    if (id) {
      setMarca(marcas.find(marca => marca.id === id));
    }
  };

  const list = () => marcas
    .filter(marca => textFilter(marca.NOMBRE, search))
    .map(marca => (
      <li className='crud-list-item'
        id={'crud-id-' + marca.id}
        data-id={marca.id}
        key={marca.id}>{marca.NOMBRE}</li>)
    );

  return (
    <div className='main-container'>
      <div className='sidebar'>
        <InputSearch value={search} onChange={event => setSearch(event.target.value)} />
        <ul id='listaMarcas' className='crud-list' onClick={liClickHandler} >
          {list()}
        </ul>
      </div>
      <div className='crud-main'>
        <div className='crud-inputs'>
          <InputText disabled context='crud-marca' col='id' value={marca.id} />
          <InputText context='crud-marca' col='NOMBRE' value={marca.NOMBRE} onChange={event => setMarca({...marca, NOMBRE: event.target.value})} onKeyPress={submitHandler} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
