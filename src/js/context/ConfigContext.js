import React, {createContext, useEffect, useReducer} from 'react';
import {getBussinessConstants} from '../database/getData';
const ConfigContext = createContext();

const initialState = {status: 'loading...'};
const reducer = (state, action) => {
  switch (action.type) {
    case 'setFromDatabase':
      return action.payload;
    default:
      return state;
  }
};

function ConfigContextProvider (props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getBussinessConstants().then(res => {
      let obj = {};
      res.forEach(row => {
        obj[row.NOMBRE] = row.VALOR;
      });
      dispatch({type: 'setFromDatabase', payload: obj});
    });
  }, []);

  return (
    <ConfigContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ConfigContext.Provider>
  );
}

export {
  ConfigContext,
  ConfigContextProvider
};
