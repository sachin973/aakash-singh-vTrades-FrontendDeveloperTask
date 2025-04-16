import { AlertCircle, CheckCircle } from 'lucide-react';
import React from 'react';

interface AlertProps {
  message?: string;
  success?: boolean;
}

const Alert: React.FC<AlertProps> = ({ message, success }) => {
  if (!message) return null;

  return (
    <div
      className={`mb-4 p-3 rounded flex items-center ${
        success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
      }`}
    >
      {success ? (
        <CheckCircle className="mr-2 h-5 w-5" />
      ) : (
        <AlertCircle className="mr-2 h-5 w-5" />
      )}
      <span>{message}</span>
    </div>
  );
};

export default Alert;
