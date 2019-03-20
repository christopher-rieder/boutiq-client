import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getPagosPendientes, getFacturasById } from '../database/getData';
import { updatePago } from '../database/writeData';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import { InputTextField, InputSelect } from '../components/inputs';
import {numberRangeFiltering} from '../utilities/filterFunctions';
import FacturaView from '../venta/FacturaView';

const columns = [
  {
    Header: 'FACTURA',
    id: 'NUMERO_FACTURA',
    width: 100,
    accessor: 'NUMERO_FACTURA',
    filterMethod: numberRangeFiltering
  },
  {
    Header: 'FECHA',
    id: 'FECHA_HORA',
    width: 200,
    accessor: e => dateFormat(new Date(e.FECHA_HORA), 'dd/MM/yyyy | HH:mm:ss'),
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['FECHA_HORA'] }),
    filterAll: true
  },
  {
    Header: 'MONTO',
    id: 'MONTO',
    accessor: 'MONTO',
    aggregate: (values, row) => console.log('values', values),
    Aggregated: row => {
      return (
        <span>
          {row.value} (avg)
        </span>
      );
    },
    filterMethod: numberRangeFiltering
  },
  {
    Header: 'ESTADO',
    id: 'ESTADO',
    accessor: e => e.ESTADO.NOMBRE,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['ESTADO'] }),
    filterAll: true
  },
  {
    Header: 'TIPO PAGO',
    id: 'TIPO_PAGO',
    width: 200,
    accessor: ({TIPO_PAGO}) => TIPO_PAGO,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['TIPO_PAGO'] }),
    filterAll: true
  }
];

const mapStateToProps = state => ({
  tablaEstadoPago: state.tabla.estadoPago
});

function ConsultaPago (props) {
  const [data, setData] = useState([]);
  const {tablaEstadoPago} = props;
  const [obj, setObj] = useState('');
  const [factura, setFactura] = useState('');

  useEffect(() => {
    getPagosPendientes()
      .then(res => {
        setData(res.map(row => ({...row, ESTADO: {id: row.ESTADO_ID, NOMBRE: row.ESTADO}})));
      });
  }, []);

  function getTdProps (state, rowInfo, column, instance) {
    return {
      onClick: (e, handleOriginal) => {
        if (rowInfo) {
          setObj(rowInfo.original);
          getFacturasById(rowInfo.original.FACTURA_ID).then(res => setFactura(res));
        }
        if (handleOriginal) handleOriginal();
      }
    };
  }

  const handlePago = event => {
    updatePago({ // call to database
      id: obj.id,
      ESTADO_ID: obj.ESTADO.id
    });
    setData(data.map(item => item.id === obj.id ? {...item, ESTADO: obj.ESTADO} : item));
  };

  return (
    <div className='container'>
      <div className='sidebar'>
        <ReactTable
          data={data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          columns={columns}
          defaultPageSize={12}
          className='-striped -highlight'
          getTdProps={getTdProps}
        />
      </div>
      <main className='main'>
        {obj !== '' && <PagoCrud {...{obj, setObj, tablaEstadoPago, handlePago}} />}
        {factura !== '' && <FacturaView obj={factura} />}
      </main>
    </div>
  );
}

// TODO: update buttons
// TODO: remove InputSelect. BUILD ESTADO STATE MACHINE. Make buttons according to that.
function PagoCrud ({obj, setObj, tablaEstadoPago, handlePago}) {
  return (
    <div>
      <InputTextField name='Numero Factura' value={obj.NUMERO_FACTURA} readOnly />
      <InputTextField name='Fecha' value={dateFormat(new Date(obj.FECHA_HORA), 'dd/MM/yyyy | HH:mm:ss')} readOnly />
      <InputTextField name='Monto' value={obj.MONTO} readOnly />
      <InputTextField name='Tipo de Pago' value={obj.TIPO_PAGO} readOnly />
      <InputSelect table={tablaEstadoPago} name='Estado de pago' accessor='NOMBRE' value={obj.ESTADO} setValue={ESTADO => setObj({...obj, ESTADO})} />
      <div className='panel'>
        <button className='codigo-search' onClick={handlePago}>ACTUALIZAR PAGO</button>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, null)(ConsultaPago);
