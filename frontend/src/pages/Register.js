// frontend/src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '', // For confirmation
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Pull state from Redux store
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
      navigate('/'); // Redirect to Home/Observation after successful login/register
    }

    dispatch(reset()); // Clear state flags after side effects
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

    if (password !== password2) {
      console.error('Passwords do not match');
      // Display error
    } else {
      const userData = {
        name,
        email,
        password,
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <h1 className="text-center mt-10 text-xl text-indigo-500">Loading...</h1>;
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-xl rounded-xl border border-gray-100">
      <h1 className="text-3xl font-serif font-light text-center text-gray-700 mb-2">
        Register the "False Self"
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Create an account to begin tracing your thoughts.
      </p>

      {isError && (
          <p className="mb-4 p-2 rounded-lg text-center bg-red-100 text-red-700">
              {message}
          </p>
      )}

      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          {/* Name Field */}
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            id="name"
            name="name"
            value={name}
            placeholder="Enter your name"
            onChange={onChange}
            required
          />
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
          {/* Password Confirm Field */}
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            id="password2"
            name="password2"
            value={password2}
            placeholder="Confirm password"
            onChange={onChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;