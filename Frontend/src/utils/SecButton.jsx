import React from 'react';

function SecButton({ children, onClick, className = '', ...props }) {
  return (
    <button
      className={`bg-stone-500 text-white rounded-md px-2 py-1 text-lg font-semibold hover:bg-stone-700 transition-all duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default SecButton;
