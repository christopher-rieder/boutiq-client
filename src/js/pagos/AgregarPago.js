import React, { useReducer } from 'react';
import { InputSelect, InputTextField, InputFloatField } from '../components/inputs';

const reducer = (state, action) => {
  switch (action.type) {
    case 'setMonto':
      return {
        ...state,
        monto: action.payload
      };
    case 'setTipoPago':
      const tipoPago = action.payload;
      const estadoPago = tipoPago.LISTA_DE_PRECIO === 'PRECIO_CONTADO'
        ? {id: 1, NOMBRE: 'PAGADO'}
        : {id: 2, NOMBRE: 'PENDIENTE'};
      return {
        ...state,
        tipoPago,
        estadoPago
      };
    default: return state;
  }
};

export default function AgregarPago (props) {
  const [pago, dispatchPago] = useReducer(reducer, {tipoPago: {id: 0, NOMBRE: ''}, monto: 0, estadoPago: {id: 0, NOMBRE: ''}});

  function handleSubmit () {
    if (pago.tipoPago && pago.monto > 0 && pago.estadoPago) {
      props.handleSelection({
        TIPO_PAGO: pago.tipoPago,
        MONTO: parseFloat(pago.monto),
        ESTADO: pago.estadoPago
      });
    }
    if (props.setDisplayModal) props.setDisplayModal(false);
  }

  return (
    <div>
      <InputSelect table='TIPO_PAGO' name='Tipos de pago' accessor='NOMBRE' value={pago.tipoPago} setValue={tipoPago => dispatchPago({type: 'setTipoPago', payload: tipoPago})} />
      <InputFloatField name='Descuento' value={pago.monto} setValue={monto => dispatchPago({type: 'setMonto', payload: monto})} autoComplete='off' />
      <InputTextField name='Estado' value={pago.estadoPago.NOMBRE} readOnly autoComplete='off' />
      <button className='codigo-search' onClick={handleSubmit}>AGREGAR PAGO</button>
    </div>
  );
}
