import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import { getArticuloById } from '../database/getData';
import { postCrudObjectToAPI } from '../database/writeData';
import { InputTextField, InputSelect, InputFloatField, InputIntField } from '../components/inputs';
import {round} from '../utilities/math';
import dialogs from '../utilities/dialogs';

const mapStateToProps = state => ({
  isPending: state.venta.isPending,
  error: state.venta.error,
  DESCUENTO_MAXIMO: state.constants.DESCUENTO_MAXIMO,
  RATIO_CONTADO: state.constants.RATIO_CONTADO,
  RATIO_COSTO: state.constants.RATIO_COSTO,
  tablaMarca: state.tabla.marca,
  tablaRubro: state.tabla.rubro
});

const mapDispatchToProps = dispatch => ({
  updateCantidadArticulo: (id, cantidad, suma) => dispatch({type: 'UPDATE_ARTICULO_CANTIDAD', payload: {id, cantidad, suma}})
});

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
    case 'fromDatabase':
      return payload;
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

function CrudArticulo ({
  DESCUENTO_MAXIMO, RATIO_CONTADO, RATIO_COSTO, tablaMarca, tablaRubro, tablaArticulo,
  updateCantidadArticulo, initialRequest
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {id, codigo, descripcion, precioLista, precioContado, precioCosto, descuento, stock, rubro, marca} = state;
  const dispatcherSetValue = type => payload => dispatch({type, payload});
  const dispatcherPrecios = type => payload => dispatch({type, payload, RATIO_CONTADO, RATIO_COSTO});

  const loadFromDatabase = id => {
    getArticuloById(id)
      .then(res => {
        dispatch({
          type: 'fromDatabase',
          payload: {
            id: res.id,
            codigo: res.CODIGO,
            descripcion: res.DESCRIPCION,
            precioLista: res.PRECIO_LISTA,
            precioContado: res.PRECIO_CONTADO,
            precioCosto: res.PRECIO_COSTO,
            descuento: res.DESCUENTO,
            stock: res.STOCK,
            rubro: {id: res.RUBRO_ID, NOMBRE: res.RUBRO_NOMBRE},
            marca: {id: res.MARCA_ID, NOMBRE: res.MARCA_NOMBRE}
          }});
      });
  };

  useEffect(() => {
    if (initialRequest && initialRequest.id) {
      loadFromDatabase(initialRequest.id);
    }
    if (initialRequest && initialRequest.codigo) {
      dispatcherSetValue('codigo')(initialRequest.codigo);
    }
  }, []);

  const handleSubmit = (event) => {
    const articulo = {
      CODIGO: codigo,
      DESCRIPCION: descripcion,
      PRECIO_LISTA: precioLista,
      PRECIO_CONTADO: precioContado,
      PRECIO_COSTO: precioCosto,
      DESCUENTO: descuento,
      STOCK: stock,
      RUBRO_ID: rubro.id,
      MARCA_ID: marca.id
    };

    if (id > 0) {
      articulo.id = id;
    }

    postCrudObjectToAPI(articulo, 'articulo')
      .then((res) => {
        dialogs.success('ARTICULO AGREGADO');
        // setTimeout(() => setArticuloData([]), 1000); // FIXME: HACKY
      })
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
        <div className='crud-grid-inputs'>
          <InputTextField fragment name='id' value={id} readOnly />
          <InputTextField fragment name='Codigo' value={codigo} setValue={dispatcherSetValue('codigo')} />
          <InputTextField fragment name='Descripcion' value={descripcion} setValue={dispatcherSetValue('descripcion')} />
          <InputFloatField fragment name='Precio de Lista' value={precioLista} setValue={dispatcherPrecios('precioLista')} autoComplete='off' />
          <InputFloatField fragment name='Precio de Contado' value={precioContado} maxValue={precioLista} setValue={dispatcherPrecios('precioContado')} autoComplete='off' />
          <InputFloatField fragment name='Precio de Costo' value={precioCosto} maxValue={precioContado} setValue={dispatcherPrecios('precioCosto')} autoComplete='off' />
          <InputIntField fragment name='Stock' value={stock} setValue={dispatcherSetValue('stock')} autoComplete='off' />
          <InputFloatField fragment name='Descuento en promo' value={descuento} maxValue={DESCUENTO_MAXIMO} setValue={dispatcherSetValue('descuento')} autoComplete='off' />
        </div>
        <InputSelect table={tablaMarca} name='Marca' accessor='NOMBRE' value={marca} setValue={dispatcherSetValue('marca')} />
        <InputSelect table={tablaRubro} name='Rubro' accessor='NOMBRE' value={rubro} setValue={dispatcherSetValue('rubro')} />
        <div>
          {id > 0 && <button className='btn-guardar' onClick={() => loadFromDatabase(state.id)}>RECARGAR</button>}
          <button className='btn-guardar' onClick={handleSubmit}>GUARDAR</button>
        </div>
      </main>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CrudArticulo);
