import React, { useState } from 'react';

interface TodoFormProps {
  onSubmit: (todo: string, category: { color: string; label: string }) => void;
  onCancel: () => void;
  initialTodo?: string;
}

interface Option {
  color: string;
  label: string;
}

const categoryOptions: Option[] = [
  { color: '#A9ACA8', label: 'Misc' },
  { color: '#CE948D', label: 'Personal' },
  { color: '#709A84', label: 'Work' },
  { color: '#6FABE2', label: 'Shopping' },
];

const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  onCancel,
  initialTodo = '',
}) => {
  const [todo, setTodo] = useState(initialTodo);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = selectedOption
      ? { color: selectedOption.color, label: selectedOption.label }
      : { color: '#A9ACA8', label: 'Misc' };

    onSubmit(todo, category);
    setTodo('');
    setSelectedOption(null);
  };

  const dot = (color: string) => {
    console.log('Color:', color); // Check if the color is being passed correctly
    return {
      backgroundColor: color,
      borderRadius: '50%',
      width: '8px',
      height: '8px',
    };
  };

  return (
    <div>
      <div className="flex justify-center mb-2">
        <div className="text-black">
          <div className="flex justify-center mb-2">
            Click the dot to select a category:
          </div>
          <div className="flex items-center">
            {categoryOptions.map((option) => (
              <span key={option.color} className="ml-2 flex items-center mx-8">
                <span className="mr-1" style={dot(option.color)}></span>
                <span>{option.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-row items-center justify-center">
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="border p-1 mr-2 w-full"
        />
        <div className="relative">
          <div
            className="flex items-center px-2 cursor-pointer"
            onClick={handleDropdownToggle}
            style={{
              backgroundColor: selectedOption ? 'white' : 'white',
              width: '24px',
              height: '32px',
              borderRadius: '20%',
              marginRight: '8px',
            }}
          >
            {selectedOption ? (
              <div style={dot(selectedOption.color)} />
            ) : (
              <div className="text-gray-600 bg-white" style={dot('#A9ACA8')} />
            )}
          </div>
          {isOpen && (
            <div className="absolute mt-2 bg-white shadow-md rounded">
              {categoryOptions.map((option) => (
                <div
                  key={option.color}
                  className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleOptionSelect(option)}
                >
                  <div style={dot(option.color)} />
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-primary mr-2"
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
