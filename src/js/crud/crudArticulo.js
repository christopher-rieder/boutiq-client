import React, { useContext, useReducer } from 'react';
import { postObjectToAPI } from '../database/writeData';
import { InputTextField, InputSelect, InputFloatField, InputIntField } from '../components/inputs';
import {round} from '../utilities/math';
import dialogs from '../utilities/dialogs';
import { ConfigContext } from '../context/ConfigContext';

const initialState = {
  id: 0,
  codigo: '',
  descripcion: '',
  precioLista: 0,
  precioContado: 0,
  precioCosto: 0,
  descuento: 0,
  stock: 0,
  rubro: {},
  marca: {}
};

// simple setters
const setters = [
  'id',
  'codigo',
  'descripcion',
  'descuento',
  'stock',
  'rubro',
  'marca',
  'promo'
];

const reducer = (state, action) => {
  const {type, payload, RATIO_CONTADO, RATIO_COSTO} = action;
  const index = setters.findIndex(setter => setter === type);
  if (index >= 0) return {...state, [setters[index]]: payload}; // simple setters

  switch (type) {
    case 'precioLista':
      return {
        ...state,
        precioLista: payload,
        precioContado: round(payload * RATIO_CONTADO),
        precioCosto: round(payload * RATIO_COSTO)
      };
    case 'precioContado':
      return {
        ...state,
        precioContado: payload,
        precioCosto: round(payload * RATIO_COSTO)
      };
    case 'precioCosto':
      return {
        ...state,
        precioCosto: payload};
    default:
      return state;
  }
};

export default function CrudArticulo (props) {
  const {state: {DESCUENTO_MAXIMO, RATIO_CONTADO, RATIO_COSTO}} = useContext(ConfigContext);
  const [state, dispatch] = useReducer(reducer, {...initialState, ...props.initialState});
  const {id, codigo, descripcion, precioLista, precioContado, precioCosto, descuento, stock, rubro, marca} = state;
  const dispatcherOnChange = type => e => dispatch({type, payload: e.target.value});
  const dispatcherSetValue = type => payload => dispatch({type, payload});
  const dispatcherPrecios = type => payload => dispatch({type, payload, RATIO_CONTADO, RATIO_COSTO});

  const handleSubmit = (event) => {
    postObjectToAPI({
      id: id,
      CODIGO: codigo,
      DESCRIPCION: descripcion,
      PRECIO_LISTA: precioLista,
      PRECIO_CONTADO: precioContado,
      PRECIO_COSTO: precioCosto,
      DESCUENTO: descuento,
      STOCK: stock,
      RUBRO_ID: rubro.id,
      MARCA_ID: marca.id
    }, 'articulo')
      .then((res) => dialogs.success('ARTICULO AGREGADO'))
      .catch((err) => dialogs.error(err));
  };

  return (
    <React.Fragment>
      <header>
        <h1 className='crud-articulo__heading'>
          CRUD ARTICULOS
        </h1>
      </header>
      <main>
        <div id='crud-articulo' className='main-grid'>
          <InputTextField name='id' value={id} readOnly />
          <InputTextField name='Codigo' value={codigo} onChange={dispatcherOnChange('codigo')} />
          <InputTextField name='Descripcion' value={descripcion} onChange={dispatcherOnChange('descripcion')} />
          <InputFloatField name='Precio de Lista' value={precioLista} setValue={dispatcherPrecios('precioLista')} autoComplete='off' />
          <InputFloatField name='Precio de Contado' value={precioContado} maxValue={precioLista} setValue={dispatcherPrecios('precioContado')} autoComplete='off' />
          <InputFloatField name='Precio de Costo' value={precioCosto} maxValue={precioContado} setValue={dispatcherPrecios('precioCosto')} autoComplete='off' />
          <InputIntField name='Stock' value={stock} setValue={dispatcherSetValue('stock')} autoComplete='off' />
          <InputFloatField name='Descuento en promo' value={descuento} maxValue={DESCUENTO_MAXIMO} setValue={dispatcherSetValue('descuento')} autoComplete='off' />
          <InputSelect table='MARCA' name='Marca' accessor='NOMBRE' value={marca} setValue={dispatcherSetValue('marca')} />
          <InputSelect table='RUBRO' name='Rubro' accessor='NOMBRE' value={rubro} setValue={dispatcherSetValue('rubro')} />
        </div>
        <div>
          <button className='btn-guardar' onClick={handleSubmit}>GUARDAR</button>
        </div>
      </main>
    </React.Fragment>
  );
}
