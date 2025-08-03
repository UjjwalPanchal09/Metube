import React from 'react';

function GeneralButton({ children, onClick, className = '', ...props }) {
  return (
    <button
      className={`bg-zinc-600 text-white px-2 py-1 text-lg font-semibold hover:bg-zinc-700 transition-all duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default GeneralButton;
