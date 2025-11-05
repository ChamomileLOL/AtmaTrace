// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register'; // <-- NEW
import Login from './pages/Login';       // <-- NEW

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />       {/* <-- NEW ROUTE */}
            <Route path="/register" element={<Register />} /> {/* <-- NEW ROUTE */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;