import {numberRangeFiltering} from '../utilities/filterFunctions';
import matchSorter from 'match-sorter';
import { format as dateFormat } from 'date-fns';

export default [
  {
    Header: 'NRO',
    id: 'numeroFactura',
    width: 60,
    accessor: 'numeroFactura',
    filterMethod: numberRangeFiltering
  },
  {
    Header: 'FECHA',
    id: 'fechaHora',
    width: 200,
    accessor: e => dateFormat(new Date(e.fechaHora), 'dd/MM/yyyy | HH:mm:ss'),
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['fechaHora'] }),
    filterAll: true
  },
  {
    Header: 'CLIENTE',
    id: 'cliente',
    width: 200,
    accessor: e => e.cliente,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['cliente'] }),
    filterAll: true
  },
  {
    Header: 'VENDEDOR',
    id: 'vendedor',
    width: 200,
    accessor: e => e.vendedor,
    filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: ['vendedor'] }),
    filterAll: true
  }
];
