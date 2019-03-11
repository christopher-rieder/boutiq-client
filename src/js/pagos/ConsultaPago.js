import React, { useState, useEffect, useContext } from 'react';
import { getPagosPendientes } from '../database/getData';
import { updatePago } from '../database/writeData';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { format as dateFormat } from 'date-fns';
import matchSorter from 'match-sorter';
import { InputTextField, InputSelect } from '../components/inputs';
import { MainContext } from '../context/MainContext';
import {numberRangeFiltering} from '../utilities/filterFunctions';

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

export default function ConsultaPago (props) {
  const [data, setData] = useState([]);
  const {tablaEstadoPago} = useContext(MainContext);
  const [obj, setObj] = useState({NUMERO_FACTURA: 0, FECHA_HORA: 0, MONTO: 0, ESTADO: tablaEstadoPago[1], TIPO_PAGO: ''});

  useEffect(() => {
    getPagosPendientes()
      .then(res => {
        setData(res.map(row => ({...row, ESTADO: {id: row.ESTADO_ID, NOMBRE: row.ESTADO}})));
      });
  }, []);

  function getTdProps (state, rowInfo, column, instance) {
    return {
      onClick: (e, handleOriginal) => {
        if (rowInfo) setObj(rowInfo.original);
        if (handleOriginal) handleOriginal();
      }
    };
  }
  function getTheadFilterProps (state, rowInfo, column, instance) {
    return {
      onClick: (e, handleOriginal) => {
        console.log('headfilter', state);

        if (handleOriginal) handleOriginal();
      }
    };
  }

  const handlePago = event => {
    updatePago({
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
          getTheadFilterProps={getTheadFilterProps}
        />
      </div>
      <main className='main'>
        <InputTextField name='Numero Factura' value={obj.NUMERO_FACTURA} readOnly />
        <InputTextField name='Fecha' value={obj.FECHA_HORA ? dateFormat(new Date(obj.FECHA_HORA), 'dd/MM/yyyy | HH:mm:ss') : ''} readOnly />
        <InputTextField name='Monto' value={obj.MONTO} readOnly />
        <InputTextField name='Tipo de Pago' value={obj.TIPO_PAGO} readOnly />
        <InputSelect table={tablaEstadoPago} name='Estado de pago' accessor='NOMBRE' value={obj.ESTADO} setValue={ESTADO => setObj({...obj, ESTADO})} />
        <div className='panel'>
          <button className='codigo-search' onClick={handlePago}>ACTUALIZAR PAGO</button>
        </div>
      </main>
    </div>
  );
}
