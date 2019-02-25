import React from 'react';

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

const InputText = ({context, col, value, onChange}) => (
  <div>
    <label
      className={context + '__label'}
      htmlFor={context + '-' + col}
    >{col}</label>
    <input
      type='text'
      autoComplete='off'
      name={context + '-' + col}
      id={context + '-' + col}
      value={value}
      onChange={onChange}
    />
  </div>
);

const InputSearch = (props) => (
  <div>
    <input
      type='search'
      className='search'
      placeholder='Search..'
      {...props}
    />
  </div>
);

export {
  Input,
  InputSearch,
  InputText
};
