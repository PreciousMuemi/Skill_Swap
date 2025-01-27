import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { Skill_Swap_backend } from '../../declarations/Skill_Swap_backend'; // Relative path
import Navbar from './components/Navbar';
import ConfigDisplay from './components/ConfigDisplay';
function App() {
  return (
    <Router>
      <AuthProvider>  {/* Wrap your routes with AuthProvider */}
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            {/* ... your routes */}
          </Routes>
          <ChatSystem />
          <ConfigDisplay />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
