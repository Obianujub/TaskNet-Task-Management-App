import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, logout } from "../auth";
import api from "../utility/api";

interface TaskType {
  _id: string;
  title: string;
  completed: boolean;
}

const Dashboard: React.FC = () => {
  const isAuthenticated = !!getToken();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await api.get("/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const completedTasks = (tasks || []).filter((task) => task.completed);
  const pendingTasks = (tasks || []).filter((task) => !task.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-white to-sky-100">
      <nav className="bg-white/30 backdrop-blur-md border-b border-white/20 shadow-md p-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-indigo-700">
          <Link to="/">TaskNet</Link>
        </h1>
        <div className="flex flex-wrap gap-2 sm:space-x-4 text-sm font-medium justify-center">
          <Link
            to="/"
            className="text-gray-700 hover:text-indigo-600 transition"
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Dashboard
              </Link>
              <span className="text-gray-500">
                ({completedTasks.length} completed)
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Welcome to Your Task Dashboard
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Pending Tasks
            </h3>
            <ul className="space-y-2">
              {pendingTasks.length === 0 ? (
                <li className="text-gray-500 italic">No pending tasks</li>
              ) : (
                pendingTasks.map((task) => (
                  <li
                    key={task._id}
                    className="p-3 bg-white rounded-lg shadow border border-gray-200 text-sm"
                  >
                    {task.title}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/30">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Completed Tasks
            </h3>
            <ul className="space-y-2">
              {completedTasks.length === 0 ? (
                <li className="text-gray-500 italic">No completed tasks</li>
              ) : (
                completedTasks.map((task) => (
                  <li
                    key={task._id}
                    className="p-3 bg-green-100 text-green-800 rounded-lg shadow border border-green-200 text-sm"
                  >
                    {task.title}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
