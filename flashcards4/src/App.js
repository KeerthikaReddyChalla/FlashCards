import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CardComponent from './CardComponent';
import AdminDashboard from './AdminDashboard';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/admin">Admin Dashboard</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CardComponent />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
