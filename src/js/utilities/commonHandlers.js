import {errorShakeEffect} from '../components/effects';

const validFloats = event => {
  if (event.key.length <= 1) {
    if (!/[0-9.]/.test(event.key) ||
          !/^\d*\.{0,1}\d*$/.test(event.target.value + event.key)) {
      event.preventDefault();
      errorShakeEffect(event.target);
      return false;
    }
  }
};

export {
  validFloats
};
