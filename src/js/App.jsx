import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Crud from './crud/crud';
import Venta from './venta/venta';
import Compra from './compra/Compra';
import ConsultaArticulo from './crud/consultaArticulo';
import ConsultaFactura from './venta/ConsultaFactura';
import ConsultaCompra from './compra/ConsultaCompra';
import ConsultaPagos from './pagos/ConsultaPago';
import CrudArticulo from './crud/crudArticulo';
import Seña from './seña/Seña';
import ConsultaSeña from './seña/ConsultaSeña';
import Retiro from './retiro/retiro';
import ConsultaRetiro from './retiro/ConsultaRetiro';
import RealizarStock from './stock/RealizarStock';
import {requestConstants, requestTables} from './utilities/requestTables.js';
import { getItemById } from './database/getData';
import Spinner from './components/Spinner';

// { loading ? <Spinner /> : props.children}

const requestClienteDefault = () => (dispatch) => {
  dispatch({type: 'REQUEST_CLIENTE_DEFAULT_PENDING'});
  getItemById('cliente', 1)
    .then(cliente => dispatch({type: 'REQUEST_CLIENTE_DEFAULT_SUCCESS', payload: cliente}))
    .catch(error => dispatch({type: 'REQUEST_CLIENTE_DEFAULT_FAILED', payload: error}));
};

const requestProveedorDefault = () => (dispatch) => {
  dispatch({type: 'REQUEST_PROVEEDOR_DEFAULT_PENDING'});
  getItemById('proveedor', 1)
    .then(proveedor => dispatch({type: 'REQUEST_PROVEEDOR_DEFAULT_SUCCESS', payload: proveedor}))
    .catch(error => dispatch({type: 'REQUEST_PROVEEDOR_DEFAULT_FAILED', payload: error}));
};

const devSession = () => (dispatch) => {
  dispatch({type: 'REQUEST_VENDEDOR_PENDING'});
  getItemById('vendedor', 1)
    .then(vendedor => dispatch({type: 'REQUEST_VENDEDOR_SUCCESS', payload: vendedor}))
    .catch(error => dispatch({type: 'REQUEST_VENDEDOR_FAILED', payload: error}));
};

const mapDispatchToProps = dispatch => ({
  onRequestConstants: () => dispatch(requestConstants()),
  onRequestClienteDefault: () => dispatch(requestClienteDefault()),
  onRequestProveedorDefault: () => dispatch(requestProveedorDefault()),
  onRequestTables: () => dispatch(requestTables()),
  devSessionStart: () => dispatch(devSession())
});

function App ({onRequestConstants, onRequestClienteDefault, onRequestProveedorDefault, onRequestTables, devSessionStart}) {
  useEffect(() => {
    onRequestConstants();
    onRequestClienteDefault();
    onRequestProveedorDefault();
    onRequestTables();
    devSessionStart();
  }, []);

  const [mainElement, setMainElement] = useState(<div />);

  return (
    <React.Fragment>
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
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='estado_pago' />)}>
                  estado_pago
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='tipo_pago' />)}>
                  tipo_pago
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='constants' />)}>
                  constants
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
              <button className='navigation__btn' >VENTA</button>
              <div className='navigation__crud-tables'>
                <button className='navigation__btn' onClick={() => setMainElement(<Venta />)}>
                  Realizar Venta
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<ConsultaFactura />)}>
                  Consultar Ventas
                </button>
              </div>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn' >COMPRA</button>
              <div className='navigation__crud-tables'>
                <button className='navigation__btn' onClick={() => setMainElement(<Compra />)}>
                  Realizar Compra
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<ConsultaCompra />)}>
                  Consultar Compras
                </button>
              </div>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn' >ARTICULO</button>
              <div className='navigation__crud-tables'>
                <button className='navigation__btn' onClick={() => setMainElement(<ConsultaArticulo handleSelection={({id}) => setMainElement(<CrudArticulo initialState={{id}} />) /* TODO: ARTICULO CRUD */} />)}>
                  Consultar Articulos
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<CrudArticulo />)}>
                  Modificar Articulos
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<RealizarStock />)}>
                  Realizar Stock (NO TERMINADO)
                </button>
              </div>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn' onClick={() => setMainElement(<ConsultaPagos />)}>PAGOS</button>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn' >SEÑAS</button>
              <div className='navigation__crud-tables'>
                <button className='navigation__btn' onClick={() => setMainElement(<Seña />)}>
                  Realizar Seña
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<ConsultaSeña />)}>
                  Consultar Señas
                </button>
              </div>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn' >RETIROS</button>
              <div className='navigation__crud-tables'>
                <button className='navigation__btn' onClick={() => setMainElement(<Retiro />)}>
                  Realizar Retiro
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<ConsultaRetiro />)}>
                  Consultar Retiros
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        {mainElement}
      </main>
    </React.Fragment>
  );
}

export default connect(null, mapDispatchToProps)(App);
