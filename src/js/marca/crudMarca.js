import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {InputText, InputSearch} from '../components/inputs';

function App () {
  const [search, setSearch] = useState('');
  const [marcas, setMarcas] = useState([]);
  const [marca, setMarca] = useState({});
  // const [marcaId, setMarcaId] = useState(0);
  // const [marcaNombre, setMarcaNombre] = useState('');

  useEffect(() => { // LOAD TABLE MARCA
    databaseRead.getTable('marca')
      .then(res => setMarcas(res));
  }, []);

  const submitDataEventListener = event => {
    if (event.which === 13) {
      const index = marcas.findIndex(e => e.id === marca.id);
      setMarcas([...marcas.slice(0, index), marca, ...marcas.slice(index + 1)]);
      databaseWrite.postObjectToAPI(marca, 'marca');
      document.querySelector('#crud-id-' + marca.id).classList.add('crud-list-item-highlight');
      setTimeout(() => document.querySelector('#crud-id-' + marca.id).classList.remove('crud-list-item-highlight'), 1000);
    }
  };

  const liClickHandler = event => {
    const index = event.target.dataset.index;
    if (index) {
      setMarca(marcas[index]);
    }
  };

  return (
    <div className='main-container'>
      <div className='sidebar'>
        <InputSearch state={[search, setSearch]} />
        <ul id='listaMarcas' className='crud-list' onClick={liClickHandler} >
          {marcas.map((marca, index) => <li className='crud-list-item' id={'crud-id-' + marca.id} data-index={index} key={marca.id}>{marca.NOMBRE}</li>)}
        </ul>
      </div>
      <div className='crud-main'>
        <div className='crud-inputs'>
          <InputText disabled context='crud-marca' col='id' value={marca.id} />
          <InputText context='crud-marca' col='NOMBRE' value={marca.NOMBRE} onChange={event => setMarca({...marca, NOMBRE: event.target.value})} onKeyPress={submitDataEventListener} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// state={[marca, event => setMarca(marca => ({id: marca.id, NOMBRE: event.target.value}))]}

// let marcas = [];

// const selectorsDOM = {
//   'crud-marca__id': document.querySelector('#crud-marca__id'),
//   'crud-marca__nombre': document.querySelector('#crud-marca__nombre'),
//   'searchMarca': document.querySelector('#searchMarca'),
//   'crud-form': document.querySelector('#crud-form')
// };

// async function loadTable () {
//   marcas = await databaseRead.getTable('marca');
// }

// function searchHandler () {
//   // Declare variables
//   var input, filter, ul, li, a, i;
//   input = document.getElementById('searchMarca');
//   filter = input.value.toUpperCase();
//   ul = document.getElementById('listaMarcas');
//   li = ul.getElementsByTagName('li');

//   // Loop through all list items, and hide those who don't match the search query
//   for (i = 0; i < li.length; i++) {
//     a = li[i].getElementsByTagName('a')[0];
//     if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
//       li[i].style.display = '';
//     } else {
//       li[i].style.display = 'none';
//     }
//   }
// }
