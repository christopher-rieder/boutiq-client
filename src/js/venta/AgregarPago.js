import React, { useState } from 'react';
import { InputSelect, InputTextField, useFormInputFloat } from '../components/inputs';

export default function AgregarPago (props) {
  const [tipoPago, setTipoPago] = useState({});
  const [estadoPago, setEstadoPago] = useState({});
  const monto = useFormInputFloat(0);

  function handleSubmit () {
    if (tipoPago && monto && estadoPago) {
      props.handleSelection({
        TIPO_PAGO: tipoPago,
        MONTO: parseFloat(monto.value),
        ESTADO: estadoPago
      });
    }
    if (props.setDisplayModal) props.setDisplayModal(false);
  }

  return (
    <div>
      <InputSelect table='TIPO_PAGO' name='Tipos de pago' accessor='NOMBRE' value={tipoPago} setValue={setTipoPago} />
      <InputTextField name='Monto' {...monto} autoComplete='off' />
      <InputSelect table='ESTADO_PAGO' name='Estado de pago' accessor='NOMBRE' value={estadoPago} setValue={setEstadoPago} />
      <button className='codigo-search' onClick={handleSubmit}>AGREGAR PAGO</button>
    </div>
  );
}
