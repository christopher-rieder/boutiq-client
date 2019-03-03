import matchSorter from 'match-sorter';
import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { getTable } from '../database/getData';

export default function Consulta (props) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    getTable(props.table).then(res => {
      setData(res);
      setColumns(Object.keys(res[0]).map((key, index) => {
        return {
          Header: key,
          id: key,
          width: props.columnsWidths[index],
          accessor: e => e[key],
          filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [key] }),
          filterAll: true
        };
      }));
    });
  }, []);

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
      data={data}
      filterable
      columns={columns}
      defaultPageSize={20}
      className='-striped -highlight'
      getTdProps={getTdProps}
    />
  );
}
