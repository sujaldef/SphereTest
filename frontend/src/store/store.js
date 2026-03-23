import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import sphereReducer from '../features/spheres/sphereSlice';
import questionReducer from '../features/questions/questionSlice';
import userReducer from '../features/users/userSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    spheres: sphereReducer,
    questions: questionReducer,
    users: userReducer,
    dashboard: dashboardReducer,
  },
  devTools: true,
});

export const selectAuth = (state) => state.auth;
export const selectSpheres = (state) => state.spheres;
export const selectQuestions = (state) => state.questions;
export const selectUsers = (state) => state.users;
export const selectDashboard = (state) => state.dashboard;

