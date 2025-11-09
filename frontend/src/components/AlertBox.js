import React from 'react';
import { useAlert } from '../context/AlertContext';

const AlertBox = () => {
  const { alert } = useAlert();

  if (!alert) return null;

  const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`${alertStyles[alert.type] || alertStyles.info} border px-4 py-3 rounded relative`}
        role="alert"
      >
        <span className="block sm:inline">{alert.message}</span>
      </div>
    </div>
  );
};

export default AlertBox;
