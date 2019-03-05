import React from 'react';

export default function Pago ({pago}) {
  return (
    <div className='venta__pago-item'>
      <p className='venta__pago-item__tipo'>
        {pago.TIPO_PAGO.NOMBRE}
      </p>
      <p className='venta__pago-item__estado'>
        {pago.ESTADO.NOMBRE}
      </p>
      <p className='venta__pago-item__mono'>
        {pago.MONTO}
      </p>
    </div>
  );
}
