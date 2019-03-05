import React, { useState, useEffect } from 'react';
import { InputSelect, InputTextField, useFormInputFloat } from '../components/inputs';

export default function AgregarPago (props) {
  const [tipoPago, setTipoPago] = useState({});
  const [estadoPago, setEstadoPago] = useState({});
  const [monto, /* */ , montoProps] = useFormInputFloat(0);

  function handleSubmit () {
    if (tipoPago && monto > 0 && estadoPago) {
      props.handleSelection({
        TIPO_PAGO: tipoPago,
        MONTO: parseFloat(monto),
        ESTADO: estadoPago
      });
    }
    if (props.setDisplayModal) props.setDisplayModal(false);
  }

  useEffect(() => {
    switch (tipoPago.id) {
      case 1: setEstadoPago({id: 1, NOMBRE: 'PAGADO'}); break;
      default: setEstadoPago({id: 2, NOMBRE: 'PENDIENTE'}); break;
    }
  }, [tipoPago]);

  return (
    <div>
      <InputSelect table='TIPO_PAGO' name='Tipos de pago' accessor='NOMBRE' value={tipoPago} setValue={setTipoPago} />
      <InputTextField name='Monto' {...montoProps} autoComplete='off' />
      <InputTextField name='Estado' value={estadoPago.NOMBRE} readOnly autoComplete='off' />
      <button className='codigo-search' onClick={handleSubmit}>AGREGAR PAGO</button>
    </div>
  );
}
