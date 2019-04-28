import React from 'react';

export default function Pago ({pago}) {
  return (
    <div className='pago-item'>
      <p className='pago-item__tipo'>
        {pago.tipoPago}
      </p>
      <p className='pago-item__estado'>
        {pago.estado}
      </p>
      <p className='pago-item__monto'>
        {pago.monto}
      </p>
    </div>
  );
}
