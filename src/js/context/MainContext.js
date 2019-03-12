import React, {createContext, useEffect, useReducer, useState} from 'react';
import {getTable, getAllArticulos, getItemById, getTurnoActual} from '../database/getData';
import {ventaReducer, ventaInitialState} from '../venta/VentaReducer';
import {compraReducer, compraInitialState} from '../compra/CompraReducer';
const MainContext = createContext();

function MainContextProvider (props) {
  const [ventaState, ventaDispatch] = useReducer(ventaReducer, ventaInitialState);
  const [compraState, compraDispatch] = useReducer(compraReducer, compraInitialState);
  const [constants, setConstants] = useState([]);
  const [tablaEstadoPago, setTablaEstadoPago] = useState([]);
  const [tablaMarca, setTablaMarca] = useState([]);
  const [tablaRubro, setTablaRubro] = useState([]);
  const [tablaTipoPago, setTablaTipoPago] = useState([]);
  const [articuloData, setArticuloData] = useState([]);
  const [consumidorFinal, setConsumidorFinal] = useState({});
  const [vendedor, setVendedor] = useState({});
  const [turno, setTurno] = useState({});

  const updateArticuloData = () => {
    if (articuloData.length === 0) {
      getAllArticulos().then(res => {
        setArticuloData(res);
      });
    }
  };

  const updateConstants = res => {
    let obj = {};
    res.forEach(row => {
      obj[row.NOMBRE] = row.VALOR;
    });
    setConstants(obj);
  };

  const updateTables = () => {
    constants.length === 0 && getTable('CONSTANTS').then(updateConstants);
    tablaEstadoPago.length === 0 && getTable('ESTADO_PAGO').then(res => setTablaEstadoPago(res));
    tablaMarca.length === 0 && getTable('MARCA').then(res => setTablaMarca(res));
    tablaRubro.length === 0 && getTable('RUBRO').then(res => setTablaRubro(res));
    tablaTipoPago.length === 0 && getTable('TIPO_PAGO').then(res => setTablaTipoPago(res));
  };

  const defaultValues = () => {
    getItemById('cliente', 1).then(res => setConsumidorFinal(res));
    getItemById('vendedor', 1).then(res => setVendedor(res));
    getTurnoActual().then(res => setTurno(res));
  };

  useEffect(defaultValues, []);
  useEffect(updateArticuloData, [articuloData]);
  useEffect(updateTables, [constants, tablaEstadoPago, tablaMarca, tablaRubro, tablaTipoPago]);

  // TODO: | LOGIN | TURNO
  // TODO: | LOGIN | VENDEDOR

  return (
    <MainContext.Provider value={{
      articuloData,
      setArticuloData,
      constants,
      consumidorFinal,
      vendedor,
      setVendedor,
      turno,
      setTurno,
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
      {props.children}
    </MainContext.Provider>
  );
}

export {
  MainContext,
  MainContextProvider
};
