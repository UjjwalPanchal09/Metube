import React from 'react';

function PrimaryButton({ children, onClick, className = '', ...props }) {
  return (
    <button
      className={`rounded-md px-2 py-1 text-lg font-semibold transition-all duration-200 ${className} bg-rose-500 text-white hover:bg-rose-700`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
