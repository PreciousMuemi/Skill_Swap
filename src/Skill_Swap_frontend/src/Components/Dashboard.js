import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  UserIcon, 
  ChartBarIcon, 
  ChatBubbleLeftRightIcon, 
  StarIcon 
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, authClient } = useAuth();
  const [principal, setPrincipal] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [userStats, setUserStats] = useState({
    skillsOffered: 0,
    skillsLearned: 0,
    exchangePoints: 0,
    reputation: 0
  });

  useEffect(() => {
    const initializePrincipal = async () => {
      if (authClient && await authClient.isAuthenticated()) {
        const userPrincipal = authClient.getIdentity().getPrincipal();
        setPrincipal(userPrincipal.toString());
      }
    };

    initializePrincipal();
  }, [authClient]);

  const sidebarNavigation = [
    { 
      name: 'Home', 
      icon: <HomeIcon className="w-6 h-6" />,
      section: 'home'
    },
    { 
      name: 'Profile', 
      icon: <UserIcon className="w-6 h-6" />,
      section: 'profile'
    },
    { 
      name: 'Skills', 
      icon: <ChartBarIcon className="w-6 h-6" />,
      section: 'skills'
    },
    { 
      name: 'Exchanges', 
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      section: 'exchanges'
    },
    { 
      name: 'Reputation', 
      icon: <StarIcon className="w-6 h-6" />,
      section: 'reputation'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-midnight-900 to-midnight-700 text-gray-100">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 70 }}
        className="w-64 bg-midnight-800 shadow-2xl p-6 space-y-6"
      >
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-midnight-600 rounded-full flex items-center justify-center">
            {principal ? principal.slice(0, 4) : '🔒'}
          </div>
          <div>
            <h2 className="font-bold text-lg">Skill Swap</h2>
            <p className="text-sm text-midnight-300">Decentralized Barter</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sidebarNavigation.map((item) => (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection(item.section)}
              className={`w-full flex items-center p-3 rounded-lg transition-all ${
                activeSection === item.section 
                  ? 'bg-midnight-600 text-blue-300' 
                  : 'hover:bg-midnight-700 text-midnight-300'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </motion.button>
          ))}
        </nav>

        <div className="mt-8 bg-midnight-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Skill Exchange Stats</h3>
          <div className="space-y-2">
            {Object.entries(userStats).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="font-bold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <main className="flex-1 p-10 bg-gradient-to-br from-midnight-900 to-midnight-800">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-midnight-800 rounded-2xl shadow-2xl p-8"
        >
          {activeSection === 'home' && (
            <div>
              <h1 className="text-3xl font-bold mb-4 text-blue-300">
                Welcome to Skill Swap
              </h1>
              {/* Add dynamic content based on active section */}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;