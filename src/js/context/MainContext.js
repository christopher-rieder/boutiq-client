import React, {createContext, useEffect, useReducer, useState} from 'react';
import {getTable, getAllArticulos, getItemById, getTurnoActual} from '../database/getData';
import {ventaReducer, ventaInitialState} from '../venta/VentaReducer';
import {compraReducer, compraInitialState} from '../compra/CompraReducer';
import Spinner from '../components/Spinner';
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
  const [proveedorDefault, setProveedorDefault] = useState({});
  const [vendedor, setVendedor] = useState({});
  const [turno, setTurno] = useState({});
  const [loading, setLoading] = useState(true);

  const updateArticuloData = async () => {
    if (articuloData.length === 0) {
      setLoading(true);
      const res = await getAllArticulos();
      setArticuloData(res);
      setLoading(false);
    }
  };

  const updateCantidad = (stock, cantidad, suma) => suma ? stock + cantidad : stock - cantidad;

  const updateCantidadArticulo = (id, cantidad, suma) => {
    setArticuloData(articuloData.map(
      articulo => articulo.id === id ? {...articulo, STOCK: updateCantidad(articulo.STOCK, cantidad, suma)} : articulo));
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

  const defaultValues = async () => {
    const cliente = await getItemById('cliente', 1);
    const proveedor = await getItemById('proveedor', 1);
    const vendedor = await getItemById('vendedor', 1);
    const turno = await getTurnoActual();
    setConsumidorFinal(cliente);
    setProveedorDefault(proveedor);
    setVendedor(vendedor);
    setTurno(turno);
    setLoading(false);
  };

  useEffect(() => {
    defaultValues();
  }, []);

  useEffect(() => {
    updateArticuloData();
  }, [articuloData]);

  useEffect(updateTables, [constants, tablaEstadoPago, tablaMarca, tablaRubro, tablaTipoPago]);

  // TODO: | LOGIN | TURNO
  // TODO: | LOGIN | VENDEDOR

  return (
    <MainContext.Provider value={{
      articuloData,
      setArticuloData,
      updateCantidadArticulo,
      constants,
      consumidorFinal,
      proveedorDefault,
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

      { loading ? <Spinner /> : props.children}
    </MainContext.Provider>
  );
}

export {
  MainContext,
  MainContextProvider
};
