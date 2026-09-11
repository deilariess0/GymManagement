import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-amber-400 text-gray-900 hover:bg-amber-500 min-h-[40px] px-4 text-sm",
    secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200 min-h-[40px] px-4 text-sm",
    outline: "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 min-h-[40px] px-4 text-sm",
    success: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 min-h-[40px] px-4 text-sm",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;