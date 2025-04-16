import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  loading = false,
  disabled = false,
  children,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
      {...rest}
    >
      {loading ? 'Please wait...' : children}
    </button>
  );
};

export default Button;
