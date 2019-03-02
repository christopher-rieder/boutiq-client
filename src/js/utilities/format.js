import * as d3Format from 'd3-format';
const money = d3Format.formatLocale({
  'decimal': ',',
  'thousands': '.',
  'grouping': [3],
  'currency': ['$', '']
}).format('($,.2f');

export {
  money
};
