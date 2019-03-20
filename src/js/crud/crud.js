import React, { useEffect, useState } from 'react';
import matchSorter from 'match-sorter';
import '../../styles/main.scss';
import { InputTextField } from '../components/inputs';
import * as databaseRead from '../database/getData';
import * as databaseWrite from '../database/writeData';
import dialogs from '../utilities/dialogs';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import {requestTable} from '../utilities/requestTables.js';

const mapDispatchToProps = dispatch => ({
  updateTable: (table) => dispatch(requestTable(table))
});

function Crud (props) {
  const [search, setSearch] = useState('');
  const [objList, setObjList] = useState([]);
  const [obj, setObj] = useState({id: 1, NOMBRE: 'OBJ'});
  const crudTable = props.table.toUpperCase(); // actions in dispatcher are in uppercase...

  const filterCol = props.filterCol || 'NOMBRE';

  useEffect(() => { // LOAD TABLE
    databaseRead.getTable(crudTable)
      .then(res => {
        setObjList(res);
        setObj(res[0]);
      })
      .catch(err => window.alert(err));
  }, [crudTable]);

  const submitUpdateHandler = async event => {
    let lastId = await databaseWrite.postCrudObjectToAPI(obj, crudTable).then(json => json.lastId);
    if (obj.id === 'NUEVO') {
      const nuevo = {...obj, id: lastId};
      setObj(nuevo);
      setObjList(objList.concat(nuevo));
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
    props.updateTable(crudTable); // update in-memory tables (if it's a table in-memory)
  };

  const createHandler = event => {
    const emptyObj = {...obj};
    Object.keys(emptyObj).forEach(key => {
      emptyObj[key] = isNaN(obj[key]) ? '' : 0;
    });
    setObj({...emptyObj, id: 'NUEVO'});
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
        key={element.id}>
        {element[filterCol]}
      </li>
    ));

  const inputs = () => Object.keys(obj).map(
    (col, i) => <InputTextField readOnly={col === 'id'} key={col + i} fragment name={col} value={obj[col] || ''} onChange={event => setObj({...obj, [col]: event.target.value})} />);

  return (
    <div className='crud-container'>
      <div className='crud-sidebar'>
        <div className='flex-spaced'>
          <InputTextField name='Buscar' value={search} autoFocus autoComplete='off' setValue={setSearch} />
          <div className='separator' />
          <Button variant='contained' color='primary' onClick={createHandler}>
            Nuevo Item
          </Button>
        </div>
        <ul className='crud-list' onClick={liClickHandler} >
          {list()}
        </ul>
      </div>
      <div className='crud-main'>
        <div className='crud-grid-inputs'>
          {inputs()}
        </div>
        <Button variant='contained' color='primary' onClick={submitUpdateHandler}>
          Guardar item
        </Button>
      </div>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(Crud);
