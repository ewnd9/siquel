import React from 'react';

export const Button = (props) => (
  <button
    {...props}
    className={`font-bold py-2 px-4 rounded bg-indigo-400 text-white ${
      props.className || ''
    }`}
  >
    {props.children}
  </button>
);
