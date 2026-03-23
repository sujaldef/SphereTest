import apiClient from '../../services/apiClient';

const AUTH_BASE = '/auth';

export const registerUser = async (payload) => {
    const response = await apiClient.post(`${AUTH_BASE}/register`, payload);
    return response.data;
};

export const loginUser = async (payload) => {
    const response = await apiClient.post(`${AUTH_BASE}/login`, payload);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await apiClient.get(`${AUTH_BASE}/me`);
    return response.data;
};

