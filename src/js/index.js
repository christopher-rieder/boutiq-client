import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Crud from './crud/crud';
import Venta from './venta/venta';
import Compra from './compra/Compra';
import ConsultaArticulo from './crud/consultaArticulo';
import ConsultaFactura from './venta/ConsultaFactura';
import ConsultaCompra from './compra/ConsultaCompra';
import CrudArticulo from './crud/crudArticulo';
import {ConfigContextProvider} from './context/ConfigContext';
import {VentaContextProvider} from './venta/VentaReducer';
import {CompraContextProvider} from './compra/CompraReducer';
import {ArticuloContextProvider} from './crud/ArticuloContext';
import '../styles/main.scss';

function App () {
  const [mainElement, setMainElement] = useState(<div />);

  return (
    <ConfigContextProvider>
      <VentaContextProvider>
        <CompraContextProvider>
          <ArticuloContextProvider>
            <header className='header'>
              <nav className='header__menu'>
                <ul className='navigation'>
                  <li className='navigation__item'>
                    <button className='navigation__btn navigation__btn-crud'>CRUD</button>
                    <div className='navigation__crud-tables'>
                      <button className='navigation__btn' onClick={() => setMainElement(<Crud table='marca' />)}>
                  marca
                      </button>
                      <button className='navigation__btn' onClick={() => setMainElement(<Crud table='rubro' />)}>
                  rubro
                      </button>
                      <button className='navigation__btn' onClick={() => setMainElement(<Crud table='proveedor' />)}>
                  proveedor
                      </button>
                      <button className='navigation__btn' onClick={() => setMainElement(<Crud table='tipo_pago' />)}>
                  tipo_pago
                      </button>
                      <button className='navigation__btn' onClick={() => setMainElement(<Crud table='vendedor' />)}>
                  vendedor
                      </button>
                      <button className='navigation__btn' onClick={() => setMainElement(<Crud table='cliente' />)}>
                  cliente
                      </button>
                    </div>
                  </li>
                  <li className='navigation__item'>
                    <button className='navigation__btn' onClick={() => setMainElement(<Venta />)} >VENTA</button>
                  </li>
                  <li className='navigation__item'>
                    <button className='navigation__btn' onClick={() => setMainElement(<Compra />)} >COMPRA</button>
                  </li>
                  <li className='navigation__item'>
                    <button className='navigation__btn' onClick={() => setMainElement(<ConsultaArticulo handleSelection={(articulo) => console.log(articulo) /* TODO: ARTICULO CRUD */} />)}>ARTICULO</button>
                  </li>
                  <li className='navigation__item'>
                    <button className='navigation__btn' onClick={() => setMainElement(<ConsultaFactura />)}>FACTURA</button>
                  </li>
                  <li className='navigation__item'>
                    <button className='navigation__btn' onClick={() => setMainElement(<ConsultaCompra />)}>COMPRA</button>
                  </li>
                  <li className='navigation__item'>
                    <button className='navigation__btn' onClick={() => setMainElement(<CrudArticulo />)}>CRUDARTICULO</button>
                  </li>
                </ul>
              </nav>
            </header>
            <main>
              {mainElement}
            </main>
          </ArticuloContextProvider>
        </CompraContextProvider>
      </VentaContextProvider>
    </ConfigContextProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
