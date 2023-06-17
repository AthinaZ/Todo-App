import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const credentials = { username, password };
      const response = await login(credentials);
      console.log(response);

      // Generate JWT token if it exists in the response
      const { accessToken } = response;
      if (accessToken) {
        // Set the JWT token in local storage or a secure storage mechanism
        localStorage.setItem('accessToken', accessToken);
      }

      navigate('/todos');
    } catch (error: any) {
      console.log(error);
      setError(
        error.message || 'An error occurred while making the login request.'
      );
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-2xl font-bold">Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-lg py-2 px-4 font-bold hover:bg-blue-700"
            >
              Login
            </button>
          </div>
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
    </div>
  );
};

export default LoginForm;
