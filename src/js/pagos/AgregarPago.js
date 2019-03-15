import React, { useState, useContext } from 'react';
import { InputSelect, InputFloatField } from '../components/inputs';
import { MainContext } from '../context/MainContext';

export default function AgregarPago (props) {
  const [pago, setPago] = useState({tipoPago: {}, monto: 0});
  const {tablaTipoPago, tablaEstadoPago} = useContext(MainContext);

  function handleSubmit () {
    if (pago.tipoPago && pago.monto > 0) {
      props.handleSelection({
        TIPO_PAGO: pago.tipoPago,
        MONTO: parseFloat(pago.monto),
        ESTADO: tablaEstadoPago[pago.tipoPago.id === 1 ? 0 : 1]
      });
    }
    if (props.setDisplayModal) props.setDisplayModal(false);
  }

  return (
    <div>
      <InputSelect table={tablaTipoPago} name='Tipos de pago' accessor='NOMBRE' value={pago.tipoPago} setValue={tipoPago => setPago({...pago, tipoPago})} />
      <InputFloatField name='Monto' value={pago.monto} setValue={monto => setPago({...pago, monto})} autoComplete='off' />
      <button className='codigo-search' onClick={handleSubmit}>AGREGAR PAGO</button>
    </div>
  );
}
