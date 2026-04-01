import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * Makes a request and returns data, or throws structured error
 * Error object will have:
 * - message: user-facing error message
 * - status: HTTP status code
 * - details: raw axios error for debugging
 */
const getData = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    // Extract meaningful error message from various error sources
    let message = 'An error occurred. Please try again.';
    let status = error.response?.status || 500;

    if (error.response?.data?.message) {
      // Backend returned error message
      message = error.response.data.message;
    } else if (error.response?.status === 404) {
      message = 'Resource not found';
    } else if (error.response?.status === 401) {
      message = 'Unauthorized. Please log in again.';
    } else if (error.response?.status === 403) {
      message = 'You do not have permission to perform this action';
    } else if (error.response?.status === 409) {
      message = 'This resource already exists';
    } else if (error.response?.status === 400) {
      message = 'Invalid request. Please check your input.';
    } else if (error.message === 'Network Error') {
      message = 'Network error. Please check your connection.';
    }

    // Create custom error with all details
    const apiError = new Error(message);
    apiError.status = status;
    apiError.originalError = error;

    throw apiError;
  }
};

export const registerUser = (payload) =>
  getData(api.post('/auth/register', payload));
export const loginUser = (payload) => getData(api.post('/auth/login', payload));
export const getMe = () => getData(api.get('/auth/me'));

export const createSphere = (payload) => getData(api.post('/spheres', payload));
export const getSpheres = () => getData(api.get('/spheres'));
export const getSphereById = (id) => getData(api.get(`/spheres/${id}`));
export const getSphereByCode = (code) =>
  getData(api.get(`/spheres/code/${encodeURIComponent(code)}`));
export const updateSphere = (id, payload) =>
  getData(api.put(`/spheres/${id}`, payload));
export const joinSphere = (payload) =>
  getData(api.post('/spheres/join', payload));
export const deleteSphere = (id) => getData(api.delete(`/spheres/${id}`));

export const createQuestion = (payload) =>
  getData(api.post('/questions', payload));
export const getQuestionsBySphere = (sphereId) =>
  getData(api.get(`/questions/${sphereId}`));
export const updateQuestion = (id, payload) =>
  getData(api.put(`/questions/${id}`, payload));
export const deleteQuestion = (id) => getData(api.delete(`/questions/${id}`));
