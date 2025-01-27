import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-midnight-blue p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Skill Swap</Link>
        </div>
        
        <ul className="flex space-x-4">
          <li><Link to="/forums" className="hover:text-blue-300">Forums</Link></li>
          <li><Link to="/mentor-match" className="hover:text-blue-300">Mentor Match</Link></li>
          <li><Link to="/profile" className="hover:text-blue-300">Profile</Link></li>
          <li><Link to="/login" className="hover:text-blue-300">Login</Link></li>
          <li><Link to="/signup" className="hover:text-blue-300">Signup</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
