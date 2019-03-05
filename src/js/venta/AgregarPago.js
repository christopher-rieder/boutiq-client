import React, { useState } from 'react';
import { InputSelect, InputTextField, useFormInputFloat, useFormInput } from '../components/inputs';

export default function AgregarPago (props) {
  const [tipoPago, setTipoPago] = useState({});
  const monto = useFormInputFloat(0);
  const estado = useFormInput('');

  function handleSubmit () {
    if (tipoPago && monto && estado) {
      props.handleSelection({
        TIPO_PAGO: tipoPago,
        MONTO: parseFloat(monto.value),
        ESTADO: estado.value
      });
    }
    if (props.setDisplayModal) props.setDisplayModal(false);
  }

  return (
    <div>
      <InputSelect table='TIPO_PAGO' name='Tipos de pago' accessor='NOMBRE' value={tipoPago} setValue={setTipoPago} />
      <InputTextField name='Monto' {...monto} autoComplete='off' />
      <InputTextField name='Estado' {...estado} />
      <button className='codigo-search' onClick={handleSubmit}>AGREGAR PAGO</button>
    </div>
  );
}
