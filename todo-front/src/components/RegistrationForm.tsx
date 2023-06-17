import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/api';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const newUser = { username, password, name };
      const response = await signUp(newUser);
      console.log(response.data);

      // Handle the successful registration
      console.log('User created successfully');
      navigate('/login');
    } catch (error: any) {
      console.log(error);
      setError(
        error.message || 'An error occurred while creating the user.'
      );
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-lg py-2 px-4 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg py-2 px-4 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg py-2 px-4 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg py-3 px-4 my-5 font-bold hover:bg-blue-700 w-full"
        >
          Register
        </button>
        <div className="flex justify-center mt-2">
          <p
            className="text-sm text-gray-500 cursor-pointer underline"
            onClick={handleGoBack}
          >
            Go back to Welcome page
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
