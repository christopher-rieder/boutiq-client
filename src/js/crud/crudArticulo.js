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
  descuentoMaximo: state.constants.descuentoMaximo,
  ratioContado: state.constants.ratioContado,
  ratioCosto: state.constants.ratioCosto,
  tablaMarca: state.tabla.marca,
  tablaRubro: state.tabla.rubro
});

const mapDispatchToProps = dispatch => ({
  updateCantidadArticulo: (id, cantidad, suma) => dispatch({type: 'UPDATE_ARTICULO_CANTIDAD', payload: {id, cantidad, suma}}),
  updateArticulo: (articulo) => dispatch({type: 'UPDATE_ARTICULO', payload: articulo}),
  addArticulo: (articulo) => dispatch({type: 'ADD_ARTICULO', payload: articulo})
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
  const {type, payload, ratioContado, ratioCosto} = action;
  const index = setters.findIndex(setter => setter === type);
  if (index >= 0) return {...state, [setters[index]]: payload}; // simple setters

  switch (type) {
    case 'fromDatabase':
      return payload;
    case 'precioLista':
      return {
        ...state,
        precioLista: payload,
        precioContado: round(payload * ratioContado),
        precioCosto: round(payload * ratioCosto)
      };
    case 'precioContado':
      return {
        ...state,
        precioContado: payload,
        precioCosto: round(payload * ratioCosto)
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
  descuentoMaximo, ratioContado, ratioCosto, tablaMarca, tablaRubro, tablaArticulo,
  updateArticulo, initialRequest, addArticulo
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {id, codigo, descripcion, precioLista, precioContado, precioCosto, descuento, stock, rubro, marca} = state;
  const dispatcherSetValue = type => payload => dispatch({type, payload});
  const dispatcherPrecios = type => payload => dispatch({type, payload, ratioContado, ratioCosto});

  const loadFromDatabase = id => {
    getArticuloById(id)
      .then(res => {
        dispatch({
          type: 'fromDatabase',
          payload: {
            id: res.id,
            codigo: res.codigo,
            descripcion: res.descripcion,
            precioLista: res.precioLista,
            precioContado: res.precioContado,
            precioCosto: res.precioCosto,
            descuento: res.descuento,
            stock: res.stock,
            rubro: {id: res.rubroId, nombre: res.rubroNombre},
            marca: {id: res.marcaId, nombre: res.marcaNombre}
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
    // Un articulo con id es un articulo a modificar, con id menor o igual a 0, agregar.
    const update = id > 0;

    const articulo = {
      codigo,
      descripcion,
      precioLista,
      precioContado,
      precioCosto,
      descuento,
      stock,
      rubroId: rubro.id,
      marcaId: marca.id
    };

    if (update) {
      articulo.id = id;
    }// back-end design: it expects undefined 'id' for new items

    postCrudObjectToAPI(articulo, 'articulo')
      .then((res) => {
        dialogs.success('ARTICULO AGREGADO');
        if (update) {
          updateArticulo({...articulo, rubro: rubro.nombre, marca: marca.nombre, id: res.lastId});
        } else {
          addArticulo({...articulo, rubro: rubro.nombre, marca: marca.nombre, id: res.lastId});
        }
      })
      .catch((err) => dialogs.error(err));
  };

  return (
    <React.Fragment>
      <header>
        <h1 className='crud-articulo__heading'>
          Modificacion de Articulos
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
          <InputFloatField fragment name='Descuento en promo' value={descuento} maxValue={descuentoMaximo} setValue={dispatcherSetValue('descuento')} autoComplete='off' />
        </div>
        <InputSelect table={tablaMarca} name='Marca' accessor='nombre' value={marca} setValue={dispatcherSetValue('marca')} />
        <InputSelect table={tablaRubro} name='Rubro' accessor='nombre' value={rubro} setValue={dispatcherSetValue('rubro')} />
        <div>
          {id > 0 && <button className='btn-guardar' onClick={() => loadFromDatabase(state.id)}>RECARGAR</button>}
          <button className='btn-guardar' onClick={handleSubmit}>GUARDAR</button>
        </div>
      </main>
    </React.Fragment>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CrudArticulo);
