// these filter functions will be called according to each column definition
// some functions just return a function without doing anything else
// all these function are high order functions for consistency, even when it's not necessary
export default {

  anchoredTextFiltering: function (boolBeggining, boolEnd) {
    const anchorBeggining = boolBeggining ? '^' : '';
    const anchorEnd = boolEnd ? '$' : '';
    // a filter anchored at the start and end will match the exact word

    return function (text, filter) {
      let regex = new RegExp(anchorBeggining + filter + anchorEnd, 'i');
      return regex.test(text);
    };
  },

  wordFiltering: function (boolSplit) {
    // check split boolean for spliting words or not.
    // then it will try to match words in separate regex
    // and the text has to pass all the filters (it's a logical AND)
    // this would be a prime candidate for a better search algorithm
    if (boolSplit) {
      return function (text, filter) {
        return filter.split(' ')
          .map(word => new RegExp(word, 'i'))
          .every(regex => regex.test(text)); // 'be je' will match 'bean jelly', but not 'bean salad'
      };
    } else {
      return function (text, filter) {
        let regex = new RegExp(filter, 'i');
        return regex.test(text);
      };
    }
  },

  numberRangeFiltering: function (boolRange) {
    if (boolRange) {
      return function (numberStr, filter) {
        let escapedFilter = filter.toString().match(/[\d\-+\s]*/g).join('');
        let filterNumber = escapedFilter.toString().match(/\d*/g).join('');

        // this tests for '300'
        if (/^\d+$/.test(escapedFilter)) {
          return parseInt(numberStr) == parseInt(filterNumber);
        }
        // this tests for '+300' or '300+'
        if (/^\+/.test(escapedFilter) || /\+$/.test(escapedFilter)) {
          return parseInt(numberStr) >= parseInt(filterNumber);
        }

        // this tests for '-300' or '300-'
        if (/^-/.test(escapedFilter) || /-$/.test(escapedFilter)) {
          return parseInt(numberStr) <= parseInt(filterNumber);
        }

        // this tests for '300-500' or '300 500'
        if (/^\d+[\s-]\d+$/.test(escapedFilter)) {
          let regex = /\d+/g;
          let filterMin = Math.min(...escapedFilter.match(regex));
          let filterMax = Math.max(...escapedFilter.match(regex));
          return parseInt(numberStr) <= parseInt(filterMax) && parseInt(numberStr) >= parseInt(filterMin);
        }
        return true;
      };
    } else {
      return function (numberStr, filter) {
        let escapedFilter = filter.toString().match(/\d*/g).join('');
        let regex = new RegExp('^' + escapedFilter + '$', 'i');
        return regex.test(numberStr);
      };
    }
  },

  booleanFiltering: function () {
    return function (boolValue, filter) {
      boolValue = boolValue !== 0; // TODO: sqlite3 doesn't have booleans, think where take care of that. maybe in the rest api?
      return boolValue === filter;
    };
  }, // true or false

  dateRangeFiltering: function () {
    return function () {
      return true;
    };
  } // TODO: use a library or package. moment.js?
};
