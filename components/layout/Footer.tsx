import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 bg-opacity-70 backdrop-blur-sm mt-8">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} AMIN TOUCH. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
