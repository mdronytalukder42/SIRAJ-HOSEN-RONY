
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-blue-600">404</h1>
                <p className="text-2xl md:text-3xl font-light text-gray-800 mb-4">
                    Sorry, we couldn't find this page.
                </p>
                <p className="text-md text-gray-500 mb-8">
                    But don't worry, you can find plenty of other things on our homepage.
                </p>
                <Link
                    to="/"
                    className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Back to Homepage
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
