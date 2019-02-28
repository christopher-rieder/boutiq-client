import React, { useState } from 'react';

const Input = ({context, tipo, value, disabled, onChange}) => {
  return (
    <div>
      <label className={context + '__label'} htmlFor={context + '-' + tipo}>{tipo}</label>
      <input
        type='text'
        disabled={disabled}
        name={context + '-' + tipo}
        id={context + '-' + tipo}
        value={value}
        onChange={onChange} />
    </div>
  );
};

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

export {
  Input,
  InputSearch,
  InputFactory,
  InputText
};
