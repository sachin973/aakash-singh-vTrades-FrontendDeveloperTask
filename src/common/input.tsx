import React, { ReactNode, ChangeEvent, FocusEvent } from 'react';

interface InputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  children?: ReactNode; // e.g., eye icon
}

const Input: React.FC<InputProps> = ({
  id,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  children,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1 capitalize">
        {id.replace(/([A-Z])/g, ' $1')}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-[10px] bg-gray-800 border ${
            error ? 'border-red-500' : 'border-gray-700'
          } text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        {children && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {children}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center">
          <span className="mr-1">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
