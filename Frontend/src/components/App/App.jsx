import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from '../Main' // Main landing page
import Profile from '../Profile'; // Saved Pets or About page
import Header from '../Header'; // Navigation
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;


