export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000/api"
    : "https://tasknet-task-management-app.onrender.com/api";
