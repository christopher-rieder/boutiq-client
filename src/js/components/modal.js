import React from 'react';
import './modal.css';

export default (props) => {
  const onClick = event => {
    if (event.target.id === 'modal') {
      props.setDisplayModal(false);
    }
  };

  return (
    <div id='modal' className='modal' style={{display: props.displayModal ? 'block' : 'none'}} onClick={onClick}>
      <div className='modal-content' >
        {props.children}
      </div>
    </div>
  );
};
