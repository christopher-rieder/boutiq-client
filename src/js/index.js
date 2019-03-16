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

const logger = createLogger();
const rootReducer = combineReducers({
  venta: ventaReducer
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
