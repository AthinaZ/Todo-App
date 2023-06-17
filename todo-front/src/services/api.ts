import axios from 'axios';
import { ITodo } from '../types/Todo';

const api = axios.create({
  baseURL: 'http://localhost:3001/', // backend API URL
});

// Function to set the JWT token in the request headers
const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/signin', credentials);
    const { data } = response;
    const accessToken = data ? data.accessToken : null;
    setAuthToken(accessToken);
    return data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to login';
  }
};

export const signUp = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await api.post('/auth/signup', credentials);
    const { data } = response;
    return data;
  } catch (error: any) {
    throw error.response?.data?.message || 'Failed to sign up';
  }
};

export const getTodos = async (
  accessToken: string | null,
  id?: number,
  completed?: boolean,
  category?: { color: string; label: string }
): Promise<ITodo[]> => {
  try {
    const params: { id?: number; completed?: boolean; category?: { color: string; label: string } } = {};
    if (id) {
      params.id = id;
    }
    if (completed !== undefined) {
      params.completed = completed;
    }
    if (category) {
      params.category = category;
    }

    const headers: { Authorization?: string } = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await api.get('/todos', { params, headers });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch todos');
  }
};

export const getUser = async (accessToken: string | null): Promise<string | null> => {
  try {
    const headers: { Authorization?: string } = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await api.get('/auth/user', { headers });
    return response.data.name;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const createTodo = async (
  todo: {
    todo: string;
    completed: boolean;
    category?: { color: string; label: string } | null;
  },
  accessToken: string | null
): Promise<ITodo> => {
  try {
    const headers: { Authorization?: string } = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // Fetch the todos of the current user
    const response = await api.get('/todos', { headers });
    const todos: ITodo[] = response.data;

    // Calculate the maximum priority for the current user
    const maxPriority = todos.reduce((max, todo) => Math.max(max, todo.priority), 0);

    // Set the priority of the new todo as one higher than the current maximum
    const todoData = {
      ...todo,
      priority: maxPriority + 1,
      category: todo.category || { color: '#A9ACA8', label: 'Misc' },
    };

    const createResponse = await api.post('/todos', todoData, { headers });
    return createResponse.data;
  } catch (error) {
    throw new Error('Error creating todo');
  }
};

export const updateTodo = async (
  id: number,
  todo: { todo?: string; completed?: boolean; category?: { color: string; label: string } | null },
  accessToken: string | null
): Promise<ITodo> => {
  try {
    const headers: { Authorization?: string } = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    // Set the default tag to { color: '#A9ACA8', label: 'Misc' } if not provided
    const todoData = {
      ...todo,
      category: todo.category || { color: '#A9ACA8', label: 'Misc' },
    };

    const response = await api.put(`/todos/${id}`, todoData, { headers });
    return response.data;
  } catch (error) {
    throw new Error('Error updating todo');
  }
};

export const deleteTodo = async (id: number, accessToken: string | null): Promise<void> => {
  try {
    const headers: { Authorization?: string } = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    await api.delete(`/todos/${id}`, { headers });
  } catch (error) {
    throw new Error('Error deleting todo');
  }
};

export const reorderTodos = async (todos: ITodo[], accessToken: string | null): Promise<void> => {
  try {
    const headers: { Authorization?: string } = {};
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const todoUpdates = todos.map((todo, index) => ({ id: todo.id, priority: index + 1 }));

    await api.patch('/todos/priorities', todoUpdates, { headers });
  } catch (error) {
    throw new Error('Error reordering todos');
  }
};

export default api;

