import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utility/constant";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be greater than 8 characters");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${baseUrl}/auth/register`, {
        firstName,
        lastName,
        email,
        password,
      });
      setMessage(true);
    } catch (error: any) {
      console.error(error);
      setError("Failed to create account. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 min-h-screen bg-gradient-to-br from-teal-50 via-white to-fuchsia-100">
          <div className="w-full max-w-md bg-white/80 rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-indigo-700 mb-6">
              Create an Account
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}
            {message && (
              <p className="text-green-600 text-sm text-center mb-4">
                User created successfully. Click{" "}
                <Link to="/login" className="underline">
                  here
                </Link>{" "}
                to login.
              </p>
            )}

            <div className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition disabled:bg-gray-400"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
              <p className="text-center text-sm text-indigo-700">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;
