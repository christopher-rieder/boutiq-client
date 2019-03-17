import matchSorter from 'match-sorter';
import React from 'react';
import {connect} from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {numberRangeFiltering} from '../utilities/filterFunctions';

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
    filterMethod: numberRangeFiltering,
    width: 60
  },
  {
    Header: 'CONTADO',
    id: 'PRECIO_CONTADO',
    accessor: 'PRECIO_CONTADO',
    filterMethod: numberRangeFiltering,
    width: 100
  },
  {
    Header: 'STOCK',
    id: 'STOCK',
    accessor: 'STOCK',
    filterMethod: numberRangeFiltering,
    width: 75
  },
  {
    Header: 'DESCUENTO',
    id: 'DESCUENTO',
    accessor: e => e.DESCUENTO + '%',
    filterMethod: numberRangeFiltering,
    width: 120
  }
];

const mapStateToProps = state => ({
  tablaArticulo: state.tabla.articulo
});

function ConsultaArticulo (props) {
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
      data={props.tablaArticulo}
      filterable
      defaultFilterMethod={(filter, row) =>
        String(row[filter.id]) === filter.value}
      columns={columns}
      defaultPageSize={20}
      className='-striped -highlight'
      getTdProps={getTdProps}
    />
  );
}

export default connect(mapStateToProps, null)(ConsultaArticulo);
