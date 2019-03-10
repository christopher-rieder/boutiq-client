import React, {createContext, useState, useEffect} from 'react';
import {getAllArticulos} from '../database/getData';

const ArticuloContext = createContext();

function ArticuloContextProvider (props) {
  const [articuloData, setArticuloData] = useState([]);

  const updateArticuloData = () => {
    if (articuloData.length === 0) {
      getAllArticulos().then(res => {
        setArticuloData(res);
      });
    }
  };

  useEffect(updateArticuloData, [articuloData]);

  return (
    <ArticuloContext.Provider value={{articuloData, setArticuloData}}>
      {props.children}
    </ArticuloContext.Provider>
  );
}

export {
  ArticuloContext,
  ArticuloContextProvider
};
