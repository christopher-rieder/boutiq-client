import matchSorter from 'match-sorter';
import React, {useState} from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {numberRangeFiltering} from '../utilities/filterFunctions';
import { format as dateFormat } from 'date-fns';

const mapStateToProps = state => ({
  tablaArticulo: state.tabla.articulo
});

function RealizarStock (props) {
  const {articuloData} = props;
  const [stockData, setStockData] = useState([...articuloData]);

  const stockUpdateHandler = (codigo) => event => {
    setStockData(stockData.map(articulo => articulo.CODIGO === codigo ? {...articulo, STOCK_REAL: event.target.value} : articulo));
  };

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
      Header: 'STOCK',
      id: 'STOCK',
      accessor: 'STOCK',
      filterMethod: numberRangeFiltering,
      width: 75
    },
    {
      Header: 'STOCK REAL',
      id: 'STOCK_REAL',
      accessor: (e) => e.STOCK_REAL,
      filterMethod: numberRangeFiltering,
      width: 150
    },
    {
      expander: true,
      Header: () => <strong>LISTO</strong>,
      width: 65,
      style: {
        cursor: 'pointer',
        fontSize: 25,
        padding: '0',
        textAlign: 'center',
        userSelect: 'none'
      }
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
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['MARCA'] }),
      filterAll: true
    },
    {
      Header: 'RUBRO',
      id: 'RUBRO',
      accessor: e => e.RUBRO,
      filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['RUBRO'] }),
      filterAll: true
    }
  ];

  function getTdProps (state, rowInfo, column, instance) {
    return {
      onClick: (e, handleOriginal) => {
        if (rowInfo && props.handleSelection) props.handleSelection(rowInfo.original);
        if (props.setDisplayModal) props.setDisplayModal(false);
        if (handleOriginal) handleOriginal();
      }
    };
  }

  return (
    <ReactTable
      data={stockData}
      filterable
      defaultFilterMethod={(filter, row) =>
        String(row[filter.id]) === filter.value}
      columns={columns}
      defaultPageSize={12}
      className='-striped -highlight'
      getTdProps={getTdProps}
    />
  );
}

export default connect(mapStateToProps, null)(RealizarStock);
