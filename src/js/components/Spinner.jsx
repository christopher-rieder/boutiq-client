import React, {useState} from 'react';
import { css } from '@emotion/core';
// First way to import
import { ClipLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: auto auto;
    border-color: red;
`;

export default function Spinner (props) {
  return (
    <div className='loading'>
      <ClipLoader
        css={override}
        sizeUnit={'px'}
        size={150}
        color={'#123abc'}
      />
    </div>
  );
}
