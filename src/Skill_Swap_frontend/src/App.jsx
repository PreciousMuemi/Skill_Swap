import { useState } from 'react';
import { Skill_Swap_backend } from 'declarations/Skill_Swap_backend';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SkillListings from './pages/SkillListings';
import MatchMaking from './pages/MatchMaking';
import Forums from './pages/Forums';
import ChatSystem from './components/ChatSystem';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/skills" element={<SkillListings />} />
            <Route path="/matchmaking" element={<MatchMaking />} />
            <Route path="/forums" element={<Forums />} />
          </Routes>
          <ChatSystem />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;