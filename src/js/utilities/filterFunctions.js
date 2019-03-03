function numberRangeFiltering (filter, row) {
  let escapedFilter = filter.value.toString().match(/[\d\-+\s]*/g).join('');
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

function dateRangeFiltering () {
  return function () {
    return true;
  };
} // TODO: use a library or package. moment.js?

export {
  numberRangeFiltering,
  dateRangeFiltering
};
