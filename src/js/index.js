import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {MainContextProvider} from './context/MainContext';
import App from './App';
import '../styles/main.scss';
import { ventaReducer } from './venta/VentaReducer';
import constantsReducer from './context/ConstantsReducer';
import defaultsReducer from './context/DefaultsReducer';
import commonTablesReducer from './context/CommonTablesReducer';
import sessionReducer from './context/SessionReducer';
import { compraReducer } from './compra/CompraReducer';
import { retiroReducer } from './retiro/RetiroReducer';

const logger = createLogger();
const rootReducer = combineReducers({
  venta: ventaReducer,
  compra: compraReducer,
  retiro: retiroReducer,
  constants: constantsReducer,
  defaults: defaultsReducer,
  tabla: commonTablesReducer,
  session: sessionReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware, logger)));

ReactDOM.render(
  <MainContextProvider>
    <Provider store={store} >
      <App />
    </Provider>
  </MainContextProvider>,
  document.getElementById('root'));
