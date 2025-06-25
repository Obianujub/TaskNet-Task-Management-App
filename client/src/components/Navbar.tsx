import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../auth";

const Navbar: React.FC = () => {
  const isAuthenticated = !!getToken();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-fuchsia-600 to-indigo-700 text-white shadow-lg p-4 px-6 flex flex-wrap items-center justify-between sticky top-0 z-50">
      <h1 className="text-2xl font-bold tracking-tight drop-shadow-md mb-2 sm:mb-0">
        <Link to="/" className="hover:text-yellow-300 transition">
          TaskNet
        </Link>
      </h1>
      <div className="flex flex-wrap gap-2 items-center justify-end text-sm font-medium">
        <Link to="/" className="hover:text-yellow-300 transition">
          Home
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-yellow-300 transition">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full transition shadow-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-300 transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full transition shadow-md"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
