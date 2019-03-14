import React from 'react';
import dialogs from '../utilities/dialogs';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import humanizeString from 'humanize-string';

const BasicInput = (props) => {
  const {fragment, name, ...componentProps} = props;
  const parsedName = humanizeString(name);

  if (fragment) {
    return (
      <React.Fragment>
        <label className='basic-input-label' htmlFor={parsedName}>{parsedName}</label>
        <Input
          defaultValue='loading...'
          id={parsedName}
          label={parsedName}
          {...componentProps}
          inputProps={{
            'aria-label': 'Description'
          }}
        />
      </React.Fragment>
    );
  } else {
    return (
      <div>
        <label className='basic-input-label' htmlFor={parsedName}>{parsedName}</label>
        <Input
          defaultValue='loading...'
          id={parsedName}
          label={parsedName}
          {...componentProps}
          inputProps={{
            'aria-label': 'Description'
          }}
        />
      </div>
    );
  }
};

const InputTextField = (props) => {
  const {setValue, ...componentProps} = props;

  function onChange (event) {
    setValue(event.target.value);
  }

  return (
    <BasicInput onChange={onChange} {...componentProps} />
  );
};

const InputFloatField = (props) => {
  // allow for numbers unfinished ending in zeros or dots
  const {maxValue, setValue, ...componentProps} = props;

  function onChange (event) {
    event.persist();
    let value = parseFloat(event.target.value || 0);
    if (/\d+[.0]+$/.test(event.target.value)) {
      value = event.target.value;
    }
    if (parseFloat(event.target.value) > maxValue) {
      value = maxValue;
      event.target.classList.add('error-shake');
      setTimeout(e => event.target.classList.remove('error-shake'), 500);
      dialogs.error(
        'EL LIMITE ES ' + parseFloat(maxValue).toFixed(2)
      );
    }
    setValue(value);
  }

  function onKeyPress (event) {
    event.persist();
    if (event.key.length <= 1) {
      if (!/[0-9.]/.test(event.key) ||
            !/^\d*\.{0,1}\d*$/.test(event.target.value + event.key)) {
        event.preventDefault();
        return false;
      }
    }
  }
  return (
    <BasicInput onKeyPress={onKeyPress} onChange={onChange} {...componentProps} />
  );
};

const InputIntField = (props) => {
  // allow for numbers unfinished ending in zeros or dots
  const {maxValue, setValue, ...componentProps} = props;

  function onChange (event) {
    event.persist();
    let value = parseInt(event.target.value || 0);
    value = isNaN(value) ? 0 : value;
    if (value > maxValue) {
      value = maxValue;
      event.target.classList.add('error-shake');
      setTimeout(e => event.target.classList.remove('error-shake'), 500);
      dialogs.error(
        'EL LIMITE ES ' + parseFloat(maxValue).toFixed(2)
      );
    }
    setValue(value);
  }

  function onKeyPress (event) {
    event.persist();
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
      return false;
    }
  }
  return (
    <BasicInput onKeyPress={onKeyPress} onChange={onChange} {...componentProps} />
  );
};

function InputSelect ({table, name, accessor, value, setValue}) {
  function onChange (e) {
    setValue(table.find(obj => obj[accessor] === e.target.value));
  }

  return (
    <div>
      <InputLabel htmlFor={name} style={{color: '#333', marginRight: '1rem'}}>{name}</InputLabel>
      <Select
        value={value[accessor] || 'cargando...'}
        onChange={onChange}
        inputProps={{
          name: name,
          id: name
        }}
      >
        {table.map(e => <MenuItem key={e.id} value={e[accessor]}>{e[accessor]}</MenuItem>)}
      </Select>
    </div>
  );
}

export { InputIntField, InputFloatField, InputSelect, InputTextField };
