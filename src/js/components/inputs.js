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
  const [search, setSearch] = props.state;

  return (
    <div>
      <input
        type='search'
        className='search'
        placeholder='Search..'
        value={search}
        onChange={event => setSearch(event.target.value)}
      />
    </div>
  );
}

export {
  Input,
  InputSearch,
  InputText
};
