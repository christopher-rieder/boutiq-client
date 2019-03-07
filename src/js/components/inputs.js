import React, { useState, useEffect } from 'react';
import dialogs from '../utilities/dialogs';
import {getTable} from '../database/getData';

const InputTextField = (props) => {
  return (
    <div>
      <label className='label' htmlFor='venta-factura'>{props.name}</label>
      <input className='main_input-rename' type='text' {...props} />
    </div>
  );
};

const InputFloatField = (props) => {
  // allow for numbers unfinished ending in zeros or dots
  const {maxValue, setValue, ...componentProps} = props;

  function onChange (event) {
    event.persist();
    let value = parseFloat(event.target.value);
    if (!/\d+[.0]+$/.test(event.target.value)) {
      value = parseFloat(event.target.value) || 0;
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

function useFormInputFloat (initialValue, maxValue) {
  const [value, setValue] = useState(initialValue);

  // allow for numbers unfinished ending in zeros or dots
  function onChange (event) {
    event.persist();
    let value = parseFloat(event.target.value);
    if (!/\d+[.0]+$/.test(event.target.value)) {
      value = parseFloat(event.target.value) || 0;
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
        event.target.classList.add('error-shake');
        setTimeout(e => event.target.classList.remove('error-shake'), 500);
        return false;
      }
    }
  }

  return [
    value,
    setValue,
    {
      value,
      onChange,
      onKeyPress
    }
  ];
}

function useFormInput (initialValue) {
  const [value, setValue] = useState(initialValue);

  function onChange (e) {
    setValue(e.target.value);
  }

  return {
    value,
    setValue,
    onChange
  };
}

function InputText ({context, col, value, onChange, onKeyPress, disabled}) {
  return (
    <div>
      <label
        className={context + '__label'}
        htmlFor={context + '-' + col}
      >{col}</label>
      <input
        disabled={disabled}
        type='text'
        autoComplete='off'
        name={context + '-' + col}
        id={context + '-' + col}
        value={value}
        onKeyPress={onKeyPress}
        onChange={onChange}
      />
    </div>
  );
}

function InputSearch (props) {
  return (
    <input
      type='search'
      className='crud-search'
      placeholder='Search..'
      {...props}
    />
  );
}

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
    case 'integer':
      return (<div key={col}><label className={table + '__label'} htmlFor={table + '-' + col} >{col}</label>
        <input value={value} className='crud-input-item' onChange={onChange} required name={col} type='number' id={'crud-' + table + '-' + col} placeholder={col} /></div>
      );
    case 'float':
      return (<div key={col}><label className={table + '__label'} htmlFor={table + '-' + col} >{col}</label>
        <input value={value} className='crud-input-item' onChange={onChange} required name={col} type='number' id={'crud-' + table + '-' + col} placeholder={col} /></div>
      );
    case 'boolean':
      return (<div key={col}><label className={table + '__label'} htmlFor={table + '-' + col} >{col}</label>
        <input value={value} className='crud-input-item' onChange={onChange} name={col} type='checkbox' id={'crud-' + table + '-' + col} /></div>
      );
    default: return '';
    // case 'select':
    //   return (<div key={col}><label className={table + '__label'} htmlFor={table + '-' + col} >{col}</label>
    //     <select required name={col} id={'crud-' + table + '-' + col} /></div>
    //   );
  }
}

/**
 *
 * @param {*} param0
 */
function InputSelect ({table, name, accessor, value, setValue}) {
  const [data, setData] = useState([{}]);

  useEffect(() => {
    getTable(table)
      .then(res => {
        setData(res);
        setValue(res[0]);
      });
  }, []);

  function onChange (e) {
    setValue(data.find(obj => obj[accessor] === e.target.value));
  }

  return (
    <div>
      <label htmlFor='venta-tipos-de-pago'>{name}</label>
      <select className='main_input-rename' name='venta-tipos-de-pago' id='venta-tipos-de-pago' value={value[accessor]} onChange={onChange}>
        {data.map(e => <option key={e.id} value={e[accessor]}>{e[accessor]}</option>)}
      </select>
    </div>
  );
}

export {
  useFormInput,
  useFormInputFloat,
  InputFloatField,
  InputSelect,
  InputTextField,
  InputSearch,
  InputFactory,
  InputText
};
