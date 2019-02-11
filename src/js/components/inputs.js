import React, { Component } from 'react';

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

const InputText = React.forwardRef((props, ref) => (
  <div>
    <label className={props.context + '__label'} htmlFor={props.context + '-' + props.tipo}>{props.tipo}</label>
    <input type='text'
      disabled={props.disabled}
      autoComplete='off'
      name={props.context + '-' + props.tipo}
      id={props.context + '-' + props.tipo}
      value={props.value}
      onChange={props.onChange}
      ref={ref} />
  </div>
));

export {
  Input,
  InputText
}
;
