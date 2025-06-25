import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-tr from-amber-50 via-white to-teal-100 flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-2xl w-full bg-white/80 backdrop-blur-lg p-6 sm:p-10 rounded-xl shadow-2xl border border-gray-300">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-indigo-800 drop-shadow-lg">
            Welcome to <span className="text-fuchsia-600">TaskNet</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Organize your day. Track your progress. Complete your goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link
              to="/register"
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full text-lg font-semibold transition-all shadow-md text-center"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white border-2 border-yellow-400 hover:bg-yellow-100 text-yellow-700 rounded-full text-lg font-semibold transition-all shadow-md text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
