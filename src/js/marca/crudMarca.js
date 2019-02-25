import * as databaseRead from '../database/getData';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {InputText, InputSearch} from '../components/inputs';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      search: '',
      marcas: [],
      currentMarcaId: 1,
      currentMarca: {},
      formNombre: ''
    };

    this.formNombreHandler = this.formNombreHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

  formNombreHandler (event) {
    this.setState({ formNombre: event.target.value });
  }

  searchHandler (event) {
    this.setState({search: event.target.value});
  }

  async componentDidMount () {
    databaseRead.getTable('marca')
      .then(marcas => this.setState({marcas}))
      .catch(err => console.log('TODO: SHOW ERROR IN UI' + err));
  }

  render () {
    return (
      <div>
        <div className='sidebar'>
          <InputSearch value={this.state.search} onChange={this.searchHandler} />
          <ul id='listaMarcas' className='crud-list'>
            {this.state.marcas.map(marca => <li key={marca.id}>{marca.NOMBRE}</li>)}
          </ul>
        </div>
        <div className='crud-main'>
          <form action='POST' className='crud-form' id='crud-form'>
            <InputText context='crud-marca' col='nombre' value={this.state.formNombre} onChange={this.formNombreHandler} />
          </form>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

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
