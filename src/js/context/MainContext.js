import React, {createContext, useEffect, useState} from 'react';
import {getTable, getAllArticulos, getItemById, getTurnoActual} from '../database/getData';
import {compraReducer, compraInitialState} from '../compra/CompraReducer';
import Spinner from '../components/Spinner';
const MainContext = createContext();

function MainContextProvider (props) {
  const [vendedor, setVendedor] = useState({});
  const [turno, setTurno] = useState({});
  const [loading, setLoading] = useState(true);

  const defaultValues = async () => {
    const vendedor = await getItemById('vendedor', 1);
    const turno = await getTurnoActual();
    setVendedor(vendedor);
    setTurno(turno);
    setLoading(false);
  };

  useEffect(() => {
    defaultValues();
  }, []);

  // TODO: | LOGIN | TURNO
  // TODO: | LOGIN | VENDEDOR

  return (
    <MainContext.Provider value={{
      vendedor,
      setVendedor,
      turno,
      setTurno
    }}>

      { loading ? <Spinner /> : props.children}
    </MainContext.Provider>
  );
}

export {
  MainContext,
  MainContextProvider
};
