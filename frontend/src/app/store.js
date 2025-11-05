// frontend/src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // thoughts: thoughtReducer, // Will be added later
  },
  // You can add middleware here if needed
});