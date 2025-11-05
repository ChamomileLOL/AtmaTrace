// frontend/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Handle lifecycle effects
  useEffect(() => {
    if (isError) {
      console.error(message);
      // In a real app, you would display a Toast/Alert here
    }

    if (isSuccess || user) {
      navigate('/'); // Redirect to Home/Observation after successful login
    }

    dispatch(reset()); // Clear state flags
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // Handle form field changes
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <h1 className="text-center mt-10 text-xl text-indigo-500">Loading...</h1>;
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-xl rounded-xl border border-gray-100">
      <h1 className="text-3xl font-serif font-light text-center text-gray-700 mb-2">
        Login as the "False Self"
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Access your previously traced thoughts.
      </p>

      {isError && (
          <p className="mb-4 p-2 rounded-lg text-center bg-red-100 text-red-700">
              {message}
          </p>
      )}

      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          {/* Email Field */}
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            id="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={onChange}
            required
          />
          {/* Password Field */}
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            id="password"
            name="password"
            value={password}
            placeholder="Enter password"
            onChange={onChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;