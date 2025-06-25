import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg border border-white/30 shadow-xl rounded-xl p-8 sm:p-10 text-center">
        <h1 className="text-6xl sm:text-7xl font-extrabold text-indigo-600 mb-4">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition text-sm sm:text-base"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
