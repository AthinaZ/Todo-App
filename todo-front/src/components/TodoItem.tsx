import React, { useState, useEffect } from 'react';
import { ITodo } from '../types/Todo';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface TodoItemProps {
  todo: ITodo;
  onEdit: (id: number, newTodo: string, newCategory: { color: string; label: string }) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onEdit,
  onDelete,
  onToggleComplete
}) => {
  const [editing, setEditing] = useState(false);
  const [newTodo, setNewTodo] = useState(todo.todo);
  const [newCategory, setNewCategory] = useState(todo.category);

  const categoryColors = [
    { color: '#A9ACA8', label: 'Misc' },
    { color: '#CE948D', label: 'Personal' },
    { color: '#709A84', label: 'Work' },
    { color: '#6FABE2', label: 'Shopping' },
  ];

  useEffect(() => {
    setNewCategory(todo.category); // Set the initial value of newCategory when editing starts
  }, [todo]);

  const handleEdit = () => {
    if (editing) {
      onEdit(todo.id, newTodo, newCategory);
    }
    setEditing(!editing);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleToggleComplete = () => {
    onToggleComplete(todo.id, !todo.completed);
  };

  const handleTodoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTodo(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = categoryColors.find((category) => category.label === e.target.value);
    if (selectedCategory) {
      setNewCategory(selectedCategory);
    }
  };

  return (
    <>
      <td className="px-4 py-2">
        {editing ? (
          <textarea
            value={newTodo}
            onChange={handleTodoChange}
            className="border resize-both w-full"
            style={{ wordWrap: 'break-word' }}
          />
        ) : (
          <span>{todo.todo}</span>
        )}
      </td>
      <td className="px-4 py-2 text-center">
        {editing ? (
          <select
            value={newCategory.label}
            onChange={handleCategoryChange}
            className="border"
          >
            {categoryColors.map((category) => (
              <option key={category.label} value={category.label}>
                {category.label}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center justify-center">
            <div
              className={`rounded-md px-2 py-1 text-white ${todo.category.color}`}
              style={{
                backgroundColor: todo.category.color,
                display: 'inline-block',
              }}
            >
              {todo.category.label}
            </div>
          </div>
        )}
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
          />
        </div>
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-center">
          <button
            className="text-gray-500 hover:text-gray-700 mr-2"
            onClick={handleEdit}
          >
            <FiEdit />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={handleDelete}
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </>
  );
};

export default TodoItem;















