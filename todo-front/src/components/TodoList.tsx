import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo, getUser, reorderTodos } from '../services/api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import { ITodo } from '../types/Todo';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [tokenExpired, setTokenExpired] = useState(false);

  useEffect(() => {
    fetchUser();
    fetchTodos();
    const intervalId = setInterval(checkTokenExpiration, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchUser = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const username = await getUser(accessToken);
      setUser(username);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchTodos = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const todos = await getTodos(accessToken);
      setTodos(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleCreateTodo = async (todo: string, category: { color: string; label: string }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await createTodo(
        { todo: todo, completed: false, category },
        accessToken
      );
      fetchTodos();
      setShowTodoForm(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleEditTodo = async (id: number, newTodo: string, newCategory: { color: string; label: string }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const updatedTodo = await updateTodo(
        id,
        { todo: newTodo, completed: false, category: newCategory },
        accessToken
      );
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? updatedTodo : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      await deleteTodo(id, accessToken);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const updatedTodo = await updateTodo(
        id,
        { ...todos.find((todo) => todo.id === id), completed },
        accessToken
      );
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? updatedTodo : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const updatedTodos = Array.from(todos);
    const [movedTodo] = updatedTodos.splice(source.index, 1);
    updatedTodos.splice(destination.index, 0, movedTodo);
    setTodos(updatedTodos);

    try {
      const accessToken = localStorage.getItem('accessToken');
      await reorderTodos(updatedTodos, accessToken);
    } catch (error) {
      console.error('Error reordering todos:', error);
    }
  };

  const checkTokenExpiration = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setTokenExpired(true);
      return;
    }
    const jwtToken = accessToken.split('.')[1];
    const decodedToken = atob(jwtToken);
    const { exp } = JSON.parse(decodedToken);
    if (exp < Date.now() / 1000) {
      setTokenExpired(true);
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  if (tokenExpired) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>
          <h1 className="text-3xl font-bold mb-4">Your session has expired. Please login again to continue using the app.</h1>
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white rounded-lg py-2 px-4 font-bold hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-todo bg-cover bg-fixed opacity-30 bg-no-repeat"></div>
        <div className="max-w-6xl mx-auto p-4 flex flex-col h-full">
          <div className="relative flex-grow">
            {user && (
              <div className="flex justify-center my-14">
                <h2 className="text-2xl font-bold text-slate-950">
                  Welcome, {user}!
                </h2>
              </div>
            )}
            <div className="flex justify-center my-10">
              <h2 className="text-2xl font-bold text-slate-950">Todo List</h2>
            </div>
            {showTodoForm ? (
              <TodoForm
                onSubmit={handleCreateTodo}
                onCancel={() => setShowTodoForm(false)}
              />
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowTodoForm(true)}
                  className="btn btn-primary text-white rounded-lg py-2 px-4 w-full font-bold hover:bg-blue-700"
                >
                  Add Todo
                </button>
              </div>
            )}
            {todos.length === 0 ? (
              <p className="text-center py-6 text-slate-950">No todos found.</p>
            ) : (
              <table className="w-full bg-white border border-gray-200 my-10">
                <thead>
                  <tr className="bg-slate-400">
                    <th className="px-4 py-2">Todo</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Completed</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <Droppable droppableId="todo-list">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {todos.map((todo, index) => (
                        <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                          {(provided) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TodoItem
                                todo={todo}
                                onEdit={handleEditTodo}
                                onDelete={handleDeleteTodo}
                                onToggleComplete={handleToggleComplete}
                              />
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </table>
            )}
            <div className="flex justify-center mt-4">
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white rounded-lg py-2 px-4 font-bold hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default TodoList;


