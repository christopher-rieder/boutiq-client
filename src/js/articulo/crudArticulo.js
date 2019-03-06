import * as databaseRead from '../database/getData';
import React, { useEffect, useState } from 'react';
import { InputTextField, InputSelect, useFormInput, useFormInputFloat } from '../components/inputs';
import { DESCUENTO_MAX, RATIO_CONTADO, RATIO_COSTO } from '../constants/bussinessConstants';
import {round} from '../utilities/math';
import dialogs from '../utilities/dialogs';

export default function CrudArticulo (props) {
  const [id, setId] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioLista, setPrecioLista, precioListaProps] = useFormInputFloat(0);
  const [precioContado, setPrecioContado, precioContadoProps] = useFormInputFloat(0);
  const [precioCosto, setPrecioCosto, precioCostoProps] = useFormInputFloat(0);
  const [promoDescuento, setPromoDescuento, promoDescuentoProps] = useFormInputFloat(0, DESCUENTO_MAX);
  const [stock, setStock] = useState(0);
  const [rubro, setRubro] = useState({});
  const [marca, setMarca] = useState({});
  const [promo, setPromo] = useState(false);

  useEffect(() => {
    setPrecioContado(round(precioLista * RATIO_CONTADO));
  }, [precioLista]);

  useEffect(() => {
    setPrecioCosto(round(precioLista * RATIO_COSTO));
  }, [precioContado]);

  useEffect(() => {
    if (precioContado > precioLista) {
      dialogs.error('El precio de contado debe ser menor al precio de lista');
      setPrecioContado(precioLista);
    }
  }, [precioLista, precioContado]);

  useEffect(() => {
    if (precioCosto > precioContado) {
      dialogs.error('El precio de costo debe ser menor al precio de contado');
      setPrecioCosto(precioContado);
    }
  }, [precioContado, precioCosto]);

  return (
    <React.Fragment>
      <header>
        <h1 className='crud-articulo__heading'>
          CRUD ARTICULOS
        </h1>
      </header>
      <main>
        <form action='' method='post' id='crud-articulo-form' encType='multipart/form-data'>
          <div id='crud-articulo' className='main-grid'>
            <InputTextField name='id' value={id} readOnly />
            <InputTextField name='Codigo' value={codigo} onChange={e => setCodigo(e.target.value)} />
            <InputTextField name='Descripcion' value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            <InputTextField name='Precio de Lista' {...precioListaProps} autoComplete='off' />
            <InputTextField name='Precio de Contado' {...precioContadoProps} autoComplete='off' />
            <InputTextField name='Precio de Costo' {...precioCostoProps} autoComplete='off' />
            <InputTextField name='Descuento en promo' {...promoDescuentoProps} autoComplete='off' />
            <InputSelect table='MARCA' name='Marca' accessor='NOMBRE' value={marca} setValue={setMarca} />
            <InputSelect table='RUBRO' name='Rubro' accessor='NOMBRE' value={rubro} setValue={setRubro} />
          </div>
          <div>
            <input type='submit' value='Guardar' className='btn-guardar' />
          </div>
        </form>
      </main>
    </React.Fragment>
  );
}

// import {articuloColumns, articuloColumsnConfig} from '../database/tableColumns';

// let markup = articuloColumns.reduce((str, col) => {
//   str += `<label for="crud-articulo__${col}">${col}</label>`;
//   switch (articuloColumsnConfig[col].type) {
//     case 'id':
//       str += `<input readonly required name=${col} type="text" id="crud-articulo__id" value="NUEVO ARTICULO">`;
//       break;
//     case 'text':
//       str += `<input required name=${col} type="text" id="crud-articulo__${col}" placeholder="${col}" autocomplete="off">`;
//       break;
//     case 'integer':
//       str += `<input required name=${col} type="number" id="crud-articulo__${col}" placeholder="${col}">`;
//       break;
//     case 'float':
//       str += `<input required name=${col} type="number" id="crud-articulo__${col}" placeholder="${col}">`;
//       break;
//     case 'boolean':
//       str += `<input name=${col} type="checkbox" id="crud-articulo__${col}">`;
//       break;
//     case 'select':
//       str += `<select required name=${col} id="crud-articulo__${col}"></select>`;
//       break;
//     default:
//       break;
//   }
//   str += `<div id=${col}OK></div>`;
//   return str;
// }, '');

// document.querySelector('#crud-articulo').insertAdjacentHTML('afterbegin', markup);

// // SET 'POST' URL

// document.querySelector('#search-codigo').addEventListener('search', async event => {
//   if (event.target.value) {
//     let articulo = await databaseRead.getArticuloByCodigo(event.target.value);
//     loadData(articulo);
//   }
//   event.target.value = '';
// });
