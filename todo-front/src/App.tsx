import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from '../src/components/Welcome';
import LoginForm from '../src/components/LoginForm';
import RegistrationForm from '../src/components/RegistrationForm';
import TodoList from '../src/components/TodoList';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/todos" element={<TodoList />} />
      </Routes>
    </Router>
  );
};

export default App;
