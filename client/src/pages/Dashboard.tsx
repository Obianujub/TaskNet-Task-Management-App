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
  deadline?: string;
  priority?: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "ongoing" | "Completed"
  >("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "deadline" | "priority">(
    "createdAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await api.get("/task/all-tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || "");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const fetchTasks = async () => {
      try {
        const res = await api.get("/task/all-tasks");
        setTasks(res.data.tasks);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "");
        }
      }
    };

    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    let temp = [...tasks];
    if (statusFilter !== "all")
      temp = temp.filter((t) => t.state === statusFilter);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      temp = temp.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }
    temp.sort((a, b) => {
      const aVal: any = a[sortBy] ?? "";
      const bVal: any = b[sortBy] ?? "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredTasks(temp);
  }, [tasks, searchTerm, statusFilter, sortBy, sortOrder]);

  const openEdit = (t: Task) => {
    setIsEditMode(true);
    setEditTaskId(t._id);
    setTitle(t.title);
    setDescription(t.description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditTaskId(null);
    setTitle("");
    setDescription("");
  };

  const handleAdd = async () => {
    try {
      await api.post("/task/add-task", { title, description });
      await fetchTasks();
      closeModal();
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || "");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/task/update-task/${editTaskId}`, { title, description });
      setTasks((prev) =>
        prev.map((t) =>
          t._id === editTaskId ? { ...t, title, description } : t
        )
      );
      closeModal();
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || "");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/task/delete-task/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || "");
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      await api.put(`/task/update-task/${id}`);
      fetchTasks();
    } catch (err) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || "");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-blue-50 dark:bg-slate-900">
      <aside className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-600 to-indigo-800 p-6 text-white shadow-lg md:relative z-20 flex flex-col">
        <h1 className="text-3xl font-bold mb-8">✔️Task Net</h1>
        <button
          onClick={() => {
            setStatusFilter("all");
            setSearchTerm("");
          }}
          className="hover:text-indigo-200 mb-4"
        >
          Tasks
        </button>
        <button onClick={logout} className="mt-auto hover:text-indigo-200">
          Logout
        </button>
      </aside>

      <main className="flex-1 ml-0 md:ml-64 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-white text-white"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="p-2 rounded border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500  placeholder:text-white text-white bg-black"
            >
              <option value="all">All Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-2 rounded border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500  placeholder:text-white text-white bg-black"
            >
              <option value="createdAt">Created</option>
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
            </select>
            <button
              onClick={() =>
                setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
              }
              className="p-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white transition"
            >
              {sortOrder === "asc" ? "Asc" : "Desc"}
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-0 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg transition"
          >
            Add Task
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setStatusFilter("ongoing")}
            className={`flex-1 text-center py-3 rounded-lg ${
              statusFilter === "ongoing"
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Ongoing Tasks
          </button>
          <button
            onClick={() => setStatusFilter("Completed")}
            className={`flex-1 text-center py-3 rounded-lg ${
              statusFilter === "Completed"
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Completed Tasks
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                  {task.title}
                </h3>
                <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
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
                      className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full"
                    >
                      ✅
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(task)}
                    className="p-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-11/12 max-w-md p-6">
            <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
              {isEditMode ? "Edit Task" : "Add New Task"}
            </h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full mb-3 p-3 border rounded-lg bg-sky-50 border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full mb-4 p-3 border rounded-lg bg-sky-50 border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={isEditMode ? handleUpdate : handleAdd}
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
