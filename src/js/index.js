import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
// import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import App from './App';
import '../styles/main.scss';
import { ventaReducer } from './venta/VentaReducer';
import constantsReducer from './context/ConstantsReducer';
import defaultsReducer from './context/DefaultsReducer';
import commonTablesReducer from './context/CommonTablesReducer';
import sessionReducer from './context/SessionReducer';
import { compraReducer } from './compra/CompraReducer';
import { retiroReducer } from './retiro/RetiroReducer';
import { señaReducer } from './seña/SeñaReducer';

// const logger = createLogger();
const rootReducer = combineReducers({
  venta: ventaReducer,
  compra: compraReducer,
  retiro: retiroReducer,
  seña: señaReducer,
  constants: constantsReducer,
  defaults: defaultsReducer,
  tabla: commonTablesReducer,
  session: sessionReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));

ReactDOM.render(
  <Provider store={store} >
    <App />
  </Provider>
  ,
  document.getElementById('root'));
