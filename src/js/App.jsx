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
import InformeTurno from './informes/InformeTurno';
import Seña from './seña/Seña';
import ConsultaSeña from './seña/ConsultaSeña';
import Retiro from './retiro/retiro';
import ConsultaRetiro from './retiro/ConsultaRetiro';
import RealizarStock from './stock/RealizarStock';
import ManejoCaja from './context/ManejoCaja';
import {requestTables} from './utilities/requestTables.js';
import { getItemById } from './database/getData';
import Spinner from './components/Spinner';
import Login from './context/Login';
import Logout from './context/Logout';

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

const mapStateToProps = state => ({
  cajaIniciada: !!(state.caja.fechaHoraInicio), // this is a cast to boolean of a truthy or falsy value
  cajaCerrada: !!(state.caja.fechaHoraCierre),
  turnoIniciado: state.session.turnoIniciado,
  modoConsulta: state.session.modoConsulta,
  turno: state.caja.turnos[state.caja.turnos.length - 1],
  modoAdmin: state.session.modoAdmin
});

const mapDispatchToProps = dispatch => ({
  onRequestClienteDefault: () => dispatch(requestClienteDefault()),
  onRequestProveedorDefault: () => dispatch(requestProveedorDefault()),
  onRequestTables: () => dispatch(requestTables())
});

function App ({
  cajaIniciada, cajaCerrada, turnoIniciado, modoConsulta, modoAdmin,
  turno,
  onRequestClienteDefault, onRequestProveedorDefault, onRequestTables}) {
  useEffect(() => {
    onRequestClienteDefault();
    onRequestProveedorDefault();
    onRequestTables();
  }, []);

  const [mainElement, setMainElement] = useState(<div />);

  if (!cajaIniciada || cajaCerrada) {
    return <ManejoCaja />;
  }

  if (!turnoIniciado) {
    return <Login />;
  }

  return (
    <React.Fragment>
      <header className='header'>
        <nav className='header__menu'>
          <ul className='navigation'>
            <li className='navigation__item'>
              <button className='navigation__btn' >CAJA</button>
              <div className='navigation__crud-tables'>
                <button className='navigation__btn' onClick={() => setMainElement(<Venta />)}>
                  Resumen de caja del dia
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<InformeTurno idTurnoActual={turno.id} />)}>
                  Resumen de turno actual
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<Logout />)}>
                  Cerrar turno actual
                </button>
              </div>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn' >VENTA</button>
              <div className='navigation__crud-tables'>
                {
                  !modoConsulta &&
                  <button className='navigation__btn' onClick={() => setMainElement(<Venta />)}>
                    Realizar Venta
                  </button>
                }
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
                <button className='navigation__btn' onClick={() => setMainElement(<ConsultaArticulo handleSelection={({id}) => setMainElement(<CrudArticulo initialRequest={{id}} />)} />)}>
                  Consultar Articulos
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<CrudArticulo />)}>
                  Modificar Articulos
                </button>
                {/* <button className='navigation__btn' onClick={() => setMainElement(<RealizarStock />)}>
                  Realizar Stock (NO TERMINADO)
                </button> */}
              </div>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn' onClick={() => setMainElement(<ConsultaPagos />)}>PAGOS</button>
            </li>
            <li className='navigation__item'>
              <button className='navigation__btn' >SEÑAS</button>
              <div className='navigation__crud-tables'>
                {
                  !modoConsulta &&
                  <button className='navigation__btn' onClick={() => setMainElement(<Seña />)}>
                    Realizar Seña
                  </button>
                }
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
            <li className='navigation__item'>
              <button className='navigation__btn navigation__btn-crud'>MOD Tabla</button>
              <div className='navigation__crud-tables'>
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='MARCA' />)}>
                  marca
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='RUBRO' />)}>
                  rubro
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='PROVEEDOR' />)}>
                  proveedor
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='TIPO_PAGO' />)}>
                  tipo_pago
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='CONSTANTS' />)}>
                  constants
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='VENDEDOR' />)}>
                  vendedor
                </button>
                <button className='navigation__btn' onClick={() => setMainElement(<Crud table='CLIENTE' />)}>
                  cliente
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
