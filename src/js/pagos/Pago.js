import React from 'react';

export default function Pago ({pago}) {
  return (
    <div className='pago-item'>
      <p className='pago-item__tipo'>
        {pago.TIPO_PAGO.NOMBRE}
      </p>
      <p className='pago-item__estado'>
        {pago.ESTADO.NOMBRE}
      </p>
      <p className='pago-item__monto'>
        {pago.MONTO}
      </p>
    </div>
  );
}
