import React, { useEffect, useState, useContext } from 'react';
import matchSorter from 'match-sorter';
import '../../styles/main.scss';
import { InputTextField } from '../components/inputs';
import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import dialogs from '../utilities/dialogs';
import { MainContext } from '../context/MainContext';

const cols = {
  marca: ['id', 'NOMBRE'],
  rubro: ['id', 'NOMBRE'],
  proveedor: ['id', 'NOMBRE'],
  estado_pago: ['id', 'NOMBRE'],
  tipo_pago: ['id', 'NOMBRE', 'LISTA_DE_PRECIO'],
  vendedor: ['id', 'NOMBRE'],
  constants: ['id', 'NOMBRE', 'VALOR'],
  cliente: ['id', 'NOMBRE', 'DOMICILIO', 'TELEFONO', 'CREDITO']
};

export default function Crud (props) {
  const {
    setConstants,
    setTablaEstadoPago,
    setTablaMarca,
    setTablaRubro,
    setTablaTipoPago
  } = useContext(MainContext);

  const [search, setSearch] = useState('');
  const [objList, setObjList] = useState([]);
  const [obj, setObj] = useState({id: 1, NOMBRE: 'OBJ'});
  const crudTable = props.table;

  const filterCol = 'NOMBRE';

  useEffect(() => { // LOAD TABLE
    databaseRead.getTable(crudTable)
      .then(res => {
        setObjList(res);
        setObj(res[0]);
      })
      .catch(err => window.alert(err));
  }, [crudTable]);

  const submitUpdateHandler = async event => {
    let lastId = await databaseWrite.postCrudObjectToAPI(obj, crudTable);
    if (obj.id === 'NUEVO') {
      const nuevo = {...obj, id: lastId};
      setObj(nuevo);
      setObjList([...objList, nuevo]);
      setTimeout(() => document.querySelector('#crud-id-' + lastId).classList.add('crud-list-item-highlight'), 0);
      setTimeout(() => document.querySelector('#crud-id-' + lastId).classList.remove('crud-list-item-highlight'), 1000);
      dialogs.success('AGREGADO', {});
    } else {
      const index = objList.findIndex(e => e.id === obj.id);
      setObjList([...objList.slice(0, index), obj, ...objList.slice(index + 1)]);
      setTimeout(() => document.querySelector('#crud-id-' + obj.id).classList.add('crud-list-item-highlight'), 0);
      setTimeout(() => document.querySelector('#crud-id-' + obj.id).classList.remove('crud-list-item-highlight'), 1000);
      dialogs.success('ACTUALIZADO');
    }
    switch (crudTable) {
      case 'constants': setTimeout(() => setConstants([]), 1000); break;
      case 'estado_pago': setTimeout(() => setTablaEstadoPago([]), 1000); break;
      case 'marca': setTimeout(() => setTablaMarca([]), 1000); break;
      case 'rubro': setTimeout(() => setTablaRubro([]), 1000); break;
      case 'tipo_pago': setTimeout(() => setTablaTipoPago([]), 1000); break;
    }
  };

  const createHandler = event => {
    setObj({id: 'NUEVO'});
  };

  const liClickHandler = event => {
    const id = parseInt(event.target.dataset.id);
    if (id) {
      setObj(objList.find(element => element.id === id));
    }
  };

  const list = () => matchSorter(objList, search, {keys: ['NOMBRE']})
    .map(element => (
      <li className='crud-list-item'
        id={'crud-id-' + element.id}
        data-id={element.id}
        key={element.id}>{element[filterCol]}
      </li>
    ));

  // const inputs = () => cols[crudTable]
  //   .map((col, i) => InputFactory(obj[col], event => setObj({...obj, [col]: event.target.value})));

  const inputs = () => cols[crudTable]
    .map((col, i) => <InputTextField fragment name={col} value={obj[col]} onChange={event => setObj({...obj, [col]: event.target.value})} />);

  return (
    <div className='crud-container'>
      <div className='crud-sidebar'>
        <InputTextField name='Buscar' value={search} autoFocus autoComplete='off' setValue={setSearch} />
        <ul className='crud-list' onClick={liClickHandler} >
          {list()}
        </ul>
      </div>
      <div className='crud-main'>
        <div className='crud-grid-inputs'>
          {inputs()}
        </div>
        <button onClick={submitUpdateHandler}>ACTUALIZAR</button>
        <button onClick={createHandler}>CREAR NUEVA</button>
      </div>
    </div>
  );
}
