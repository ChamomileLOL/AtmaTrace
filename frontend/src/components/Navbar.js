// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold text-indigo-700 tracking-wider">
          ĀtmaTrace
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-indigo-600 transition duration-150">
            Self Observation
          </Link>

          {user ? (
            // Show Logout button if user is logged in
            <button
              onClick={onLogout}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition duration-150"
            >
              Logout ({user.name})
            </button>
          ) : (
            // Show Login/Register buttons if user is logged out
            <>
              <Link to="/login" className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-150">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-150">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;