import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  try {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
      try {
        await logout();
        // Redirect after logout.  Ideally, this redirect should be handled
        // within your AuthContext's logout function itself to keep
        // navigation logic centralized.
        navigate('/'); // Redirect to home
      } catch (error) {
        console.error("Logout error:", error);
        // Handle logout error (e.g., display a message to the user)
      }
    };

    return (
      <nav className="bg-midnight-blue p-4 text-white flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">Skill Swap</Link>
        </div>

        <ul className="flex space-x-4">
          <li key="forums">
            <Link to="/forums">Forums</Link>
          </li>
          {user ? (
            <>
              <li key="profile">
                <Link to="/profile">Profile</Link>
              </li>
              <li key="logout">
                <button onClick={handleLogout} aria-label="Logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li key="login">
                <Link to="/login">Login</Link>
              </li>
              <li key="signup">
                <Link to="/signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    );
  } catch (error) {
    console.error("Error in useAuth:", error);
    // Render a fallback UI or error message
    return <div>Error loading authentication context.</div>;
  }
};
export default Navbar;