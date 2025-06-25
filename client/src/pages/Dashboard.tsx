import { useEffect, useState } from "react";
import api from "../utility/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;
  title: string;
  description: string;
  state: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"ongoing" | "Completed">("ongoing");

  const fetchTask = async () => {
    try {
      const res = await api.get("/task/all-tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message);
    }
  };

  const handleAddTask = async () => {
    try {
      await api.post("/task/add-task", { title, description });
      await fetchTask();
      closeModal();
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message);
    }
  };

  const handleUpdateTask = async () => {
    try {
      await api.put(`/task/update-task/${editTaskId}`, { title, description });
      setTasks((prev) =>
        prev.map((t) =>
          t._id === editTaskId ? { ...t, title, description } : t
        )
      );
      closeModal();
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message);
    }
  };

  const openUpdateModal = (task: Task) => {
    setIsEditMode(true);
    setEditTaskId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditTaskId(null);
    setTitle("");
    setDescription("");
  };

  const markAsCompleted = async (id: string) => {
    try {
      await api.put(`/task/update-task/${id}`);
      await fetchTask();
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/task/delete-task/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id)); // Update state immutably :contentReference[oaicite:2]{index=2}
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchTask();
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-sky-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-teal-600 to-violet-700 text-white shadow-lg md:relative z-20 p-6 flex flex-col justify-between">
        <h1 className="text-3xl font-bold mb-8">✔️Task Net</h1>
        <button
          onClick={() => setFilter("ongoing")}
          className="text-left hover:text-teal-200"
        >
          Tasks
        </button>
        <button
          onClick={logout}
          className="mt-auto text-teal-200 hover:text-white"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 sm:mb-0">
            My Tasks
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded-lg transition"
          >
            Add Task
          </button>
        </header>

        <div className="flex overflow-x-auto mb-6 space-x-4">
          {["ongoing", "Completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`flex-1 text-center py-3 rounded-lg ${
                filter === s
                  ? s === "ongoing"
                    ? "bg-amber-500 text-white"
                    : "bg-green-500 text-white"
                  : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              {s === "ongoing" ? "Ongoing Tasks" : "Completed Tasks"}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tasks
            .filter((t) => t.state === filter)
            .map((task) => (
              <div
                key={task._id}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {task.title}
                  </h3>
                  <p className="text-xs italic text-slate-500 dark:text-slate-400 mb-2">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2">
                    {task.description}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      task.state === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {task.state}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {task.state === "ongoing" && (
                      <button
                        onClick={() => markAsCompleted(task._id)}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
                      >
                        ✅
                      </button>
                    )}
                    <button
                      onClick={() => openUpdateModal(task)}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-3 rounded-lg transition-shadow shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-11/12 max-w-md p-6">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              {isEditMode ? "Edit Task" : "Add New Task"}
            </h3>
            <input
              type="text"
              placeholder="Title"
              className="w-full mb-3 p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-sky-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="w-full mb-4 p-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-sky-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-slate-300 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdateTask : handleAddTask}
                className="px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition"
              >
                {isEditMode ? "Save Changes" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
