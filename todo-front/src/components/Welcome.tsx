import React from 'react';
import { Link } from 'react-router-dom';

const Welcome: React.FC = () => {
  return (
    <div className="bg-slate-200 min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl text-slate-800 font-bold mb-8">Welcome to Simple To-Do App</h1>
      <p className="text-lg text-black mb-8">Sign in or Sign up to get started.</p>
      <div className="flex space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
          Sign In
        </Link>
        <Link to="/register" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
