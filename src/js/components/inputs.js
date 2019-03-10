import React from 'react';
import dialogs from '../utilities/dialogs';

const InputTextField = (props) => {
  return (
    <div>
      <label className='label' htmlFor={props.name}>{props.name}</label>
      <input className='main_input-rename' id={props.name} type='text' {...props} />
    </div>
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
    <InputTextField onKeyPress={onKeyPress} onChange={onChange} {...componentProps} />
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
    <InputTextField onKeyPress={onKeyPress} onChange={onChange} {...componentProps} />
  );
};

function InputFactory (col, type, table, value, onChange) {
  switch (type) {
    case 'id':
      return (
        <div className='crud-input-container' key={col}>
          <fieldset className='crud-input-fieldset' >
            <legend className='crud-input-legend' htmlFor={table + '-' + col} >{col}</legend>
          </fieldset>
          <input value={value} className='crud-input-item' onChange={onChange} readOnly required name={col} type='text' id={'crud-' + table + '-' + col} />
        </div>
      );
    case 'text':
      return (
        <div className='crud-input-container' key={col}>
          <fieldset className='crud-input-fieldset' >
            <legend className='crud-input-legend' htmlFor={table + '-' + col} >{col}</legend>
          </fieldset>
          <input value={value} className='crud-input-item' onChange={onChange} required name={col} type='text' id={'crud-' + table + '-' + col} placeholder={col} autoComplete='off' />
        </div>
      );
    default: return '';
  }
}

function InputSelect ({table, name, accessor, value, setValue}) {
  function onChange (e) {
    setValue(table.find(obj => obj[accessor] === e.target.value));
  }

  return (
    <div>
      <label htmlFor='venta-tipos-de-pago'>{name}</label>
      <select className='main_input-rename' name='venta-tipos-de-pago' id='venta-tipos-de-pago' value={value[accessor]} onChange={onChange}>
        {table.map(e => <option key={e.id} value={e[accessor]}>{e[accessor]}</option>)}
      </select>
    </div>
  );
}

export { InputIntField, InputFloatField, InputSelect, InputTextField, InputFactory };
