import React, { useEffect, useState } from 'react';
import {getAllArticulos} from '../database/getData';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import matchSorter from 'match-sorter';

function numFilter (filter, row) {
  let escapedFilter = filter.value.match(/[\d\-+\s]*/g).join('');
  let filterNumber = escapedFilter.toString().match(/\d*/g).join('');

  // this tests for '300'
  if (/^\d+$/.test(escapedFilter)) {
    return parseInt(row[filter.id]) === parseInt(filterNumber);
  }
  // this tests for '+300' or '300+'
  if (/^\+/.test(escapedFilter) || /\+$/.test(escapedFilter)) {
    return parseInt(row[filter.id]) >= parseInt(filterNumber);
  }

  // this tests for '-300' or '300-'
  if (/^-/.test(escapedFilter) || /-$/.test(escapedFilter)) {
    return parseInt(row[filter.id]) <= parseInt(filterNumber);
  }

  // this tests for '300-500' or '300 500'
  if (/^\d+[\s-]\d+$/.test(escapedFilter)) {
    let regex = /\d+/g;
    let filterMin = Math.min(...escapedFilter.match(regex));
    let filterMax = Math.max(...escapedFilter.match(regex));
    return parseInt(row[filter.id]) <= parseInt(filterMax) && parseInt(row[filter.id]) >= parseInt(filterMin);
  }
  return true;
}

const columns = [
  {
    Header: 'CODIGO',
    id: 'CODIGO',
    className: 'cell-codigo',
    accessor: e => e.CODIGO,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['CODIGO'] }),
    width: 150,
    filterAll: true
  },
  {
    Header: 'DESCRIPCION',
    id: 'DESCRIPCION',
    accessor: e => e.DESCRIPCION,
    minWidth: 400,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['DESCRIPCION'] }),
    filterAll: true
  },
  {
    Header: 'MARCA',
    id: 'MARCA',
    accessor: e => e.MARCA,
    minWidth: 120,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['MARCA'] }),
    filterAll: true
  },
  {
    Header: 'RUBRO',
    id: 'RUBRO',
    accessor: e => e.RUBRO,
    minWidth: 150,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['RUBRO'] }),
    filterAll: true
  },
  {
    Header: 'LISTA',
    id: 'PRECIO_LISTA',
    accessor: 'PRECIO_LISTA',
    filterMethod: numFilter,
    width: 60
  },
  {
    Header: 'CONTADO',
    id: 'PRECIO_CONTADO',
    accessor: 'PRECIO_CONTADO',
    filterMethod: numFilter,
    width: 100
  },
  {
    Header: 'STOCK',
    id: 'STOCK',
    accessor: 'STOCK',
    filterMethod: numFilter,
    width: 75
  },
  {
    Header: 'PROMO',
    id: 'DESCUENTO_PROMO',
    accessor: e => e.PROMO_BOOL ? e.DESCUENTO_PROMO + '%' : '',
    filterMethod: numFilter,
    width: 120
  }
];

export default function ConsultaArticulo (props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllArticulos().then(res => {
      setData(res);
    });
  }, []);

  function getTdProps (state, rowInfo, column, instance) {
    return {
      onClick: (e, handleOriginal) => {
        props.handleSelection(rowInfo.original);
        props.setDisplayModal(false);
        if (handleOriginal) handleOriginal();
      }
    };
  }

  return (
    <ReactTable
      data={data}
      filterable
      defaultFilterMethod={(filter, row) =>
        String(row[filter.id]) === filter.value}
      columns={columns}
      defaultPageSize={25}
      className='-striped -highlight'
      getTdProps={getTdProps}
    />
  );
}
