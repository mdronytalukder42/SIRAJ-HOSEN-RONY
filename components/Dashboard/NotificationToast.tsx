import React, { useEffect, useState } from 'react';

interface NotificationToastProps {
  message: string;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setVisible(true);

    // Set timeout to automatically close
    const timer = setTimeout(() => {
      handleClose();
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    // Allow animation to finish before removing from DOM
    setTimeout(onClose, 300); 
  };
  
  const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        flex items-start p-4 w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg shadow-lg
      `}
    >
      <div className="flex-shrink-0">
        <BellIcon />
      </div>
      <div className="ml-3 w-0 flex-1">
        <p className="text-sm font-medium text-white">New Entry Added</p>
        <p className="mt-1 text-sm text-gray-300">{message}</p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={handleClose}
          className="inline-flex text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
