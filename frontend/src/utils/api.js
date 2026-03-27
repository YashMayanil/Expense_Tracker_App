import axios from 'axios';

const API = axios.create({
  baseURL: 'https://expense-tracker-app-82en.onrender.com/api/v1',
  withCredentials: true,
});

// User APIs
export const registerUser = (data) => API.post('/user/register', data);
export const loginUser = (data) => API.post('/user/login', data);
export const logoutUser = () => API.get('/user/logout');

// Expense APIs
export const addExpense = (data) => API.post('/expense/add', data);
export const getAllExpenses = (params) => API.get('/expense/getAll', { params });
export const removeExpense = (id) => API.delete(`/expense/remove/${id}`);
export const updateExpense = (id, data) => API.put(`/expense/update/${id}`, data);
export const markDoneUndone = (id, data) => API.put(`/expense/${id}/done`, data);

export default API;
