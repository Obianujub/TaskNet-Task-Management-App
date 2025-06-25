import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utility/constant";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "An error occurred");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 min-h-screen bg-gradient-to-tr from-fuchsia-100 via-white to-sky-100">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/30">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-indigo-700 mb-6">
              Log In to Your Account
            </h2>

            {error && (
              <p className="text-red-600 text-center text-sm mb-4">{error}</p>
            )}

            <div className="space-y-4">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-16"
                />
                <span
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-sm text-indigo-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition disabled:bg-gray-400"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
              <p className="text-center text-sm text-indigo-700">
                Don't have an account?{" "}
                <Link to="/register" className="underline">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
