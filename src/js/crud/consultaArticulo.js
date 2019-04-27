import matchSorter from 'match-sorter';
import React from 'react';
import {connect} from 'react-redux';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {numberRangeFiltering} from '../utilities/filterFunctions';

const columns = [
  {
    Header: 'CODIGO',
    id: 'codigo',
    className: 'cell-codigo',
    accessor: e => e.codigo,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['codigo'] }),
    width: 150,
    filterAll: true
  },
  {
    Header: 'DESCRIPCION',
    id: 'descripcion',
    accessor: e => e.descripcion,
    minWidth: 400,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['descripcion'] }),
    filterAll: true
  },
  {
    Header: 'MARCA',
    id: 'marca',
    accessor: e => e.marca,
    minWidth: 120,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['marca'] }),
    filterAll: true
  },
  {
    Header: 'RUBRO',
    id: 'rubro',
    accessor: e => e.rubro,
    minWidth: 150,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['rubro'] }),
    filterAll: true
  },
  {
    Header: 'LISTA',
    id: 'precioLista',
    accessor: 'precioLista',
    filterMethod: numberRangeFiltering,
    width: 60
  },
  {
    Header: 'CONTADO',
    id: 'precioContado',
    accessor: 'precioContado',
    filterMethod: numberRangeFiltering,
    width: 100
  },
  {
    Header: 'STOCK',
    id: 'stock',
    accessor: 'stock',
    filterMethod: numberRangeFiltering,
    width: 75
  },
  {
    Header: 'DESCUENTO',
    id: 'descuento',
    accessor: e => e.descuento + '%',
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
