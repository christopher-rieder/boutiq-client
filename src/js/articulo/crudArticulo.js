import databaseRead from '../database/getData';

const idDOM = document.querySelector('#crud-articulo__id');
const codigoDOM = document.querySelector('#crud-articulo__codigo');
const descripcionDOM = document.querySelector('#crud-articulo__descripcion');
const precioListaDOM = document.querySelector('#crud-articulo__precio-lista');
const precioContadoDOM = document.querySelector('#crud-articulo__precio-contado');
const precioCostoDOM = document.querySelector('#crud-articulo__precio-costo');
const stockDOM = document.querySelector('#crud-articulo__stock');
const rubroDOM = document.querySelector('#crud-articulo__rubro');
const marcaDOM = document.querySelector('#crud-articulo__marca');
const promoDOM = document.querySelector('#crud-articulo__promo');
const descuentoDOM = document.querySelector('#crud-articulo__descuento');

window.onload(async event => {
  let articuloData = await databaseRead.getArticuloByCodigo(1);
});
