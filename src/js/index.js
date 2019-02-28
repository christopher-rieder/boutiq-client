import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Crud from './crud/crud';
import '../styles/main.scss';

function App () {
  const [crudTable, setCrudTable] = useState('marca');

  return (
    <React.Fragment>
      <header className='header'>
        <nav className='header__menu'>
          <ul className='navigation'>
            <li className='navigation__item'>
              <button className='navigation__btn navigation__btn-crud'>CRUD</button>
              <div className='navigation__crud-tables'>
                <button className='navigation__btn' onClick={() => setCrudTable('marca')}>
                  marca
                </button>
                <button className='navigation__btn' onClick={() => setCrudTable('rubro')}>
                  rubro
                </button>
                <button className='navigation__btn' onClick={() => setCrudTable('proveedor')}>
                  proveedor
                </button>
                <button className='navigation__btn' onClick={() => setCrudTable('tipo_pago')}>
                  tipo_pago
                </button>
                <button className='navigation__btn' onClick={() => setCrudTable('vendedor')}>
                  vendedor
                </button>
                <button className='navigation__btn' onClick={() => setCrudTable('cliente')}>
                  cliente
                </button>
              </div>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn'>VENTA</button>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn'>ARTICULO</button>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn'>FACTURA</button>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn'>CRUDARTICULO</button>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Crud crudTable={{crudTable: [crudTable, setCrudTable]}} />
      </main>
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
