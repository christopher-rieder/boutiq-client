import React, {createContext, useEffect, useReducer, useState} from 'react';
import {getTable, getBussinessConstants} from '../database/getData';
import {ventaReducer, ventaInitialState} from '../venta/VentaReducer';
import {compraReducer, compraInitialState} from '../compra/CompraReducer';
const MainContext = createContext();

function MainContextProvider (props) {
  const [constants, setConstants] = useState({});
  const [ventaState, ventaDispatch] = useReducer(ventaReducer, ventaInitialState);
  const [compraState, compraDispatch] = useReducer(compraReducer, compraInitialState);
  const [render, setRender] = useState(false);
  const [tablaEstadoPago, setTablaEstadoPago] = useState([]);
  const [tablaMarca, setTablaMarca] = useState([]);
  const [tablaRubro, setTablaRubro] = useState([]);
  const [tablaTipoPago, setTablaTipoPago] = useState([]);

  async function loadEverything () {
    const CONSTANTS = await getTable('CONSTANTS');
    let obj = {};
    CONSTANTS.forEach(row => {
      obj[row.NOMBRE] = row.VALOR;
    });
    setConstants(obj);
    const ESTADO_PAGO = await getTable('ESTADO_PAGO');
    const MARCA = await getTable('MARCA');
    const RUBRO = await getTable('RUBRO');
    const TIPO_PAGO = await getTable('TIPO_PAGO');
    setTablaEstadoPago(ESTADO_PAGO);
    setTablaMarca(MARCA);
    setTablaRubro(RUBRO);
    setTablaTipoPago(TIPO_PAGO);

    setRender(true);
  }

  // TODO: | LOGIN | TURNO
  // TODO: | LOGIN | VENDEDOR

  useEffect(() => {
    loadEverything();
  }, []);

  return (
    <MainContext.Provider value={{
      constants,
      setConstants,
      ventaState,
      ventaDispatch,
      compraState,
      compraDispatch,
      tablaEstadoPago,
      setTablaEstadoPago,
      tablaMarca,
      setTablaMarca,
      tablaRubro,
      setTablaRubro,
      tablaTipoPago,
      setTablaTipoPago
    }}>
      {render && props.children}
    </MainContext.Provider>
  );
}

export {
  MainContext,
  MainContextProvider
};
