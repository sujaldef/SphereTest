import apiClient from '../../services/apiClient';

const USER_BASE = '/users';

export const fetchMe = async () => {
    const response = await apiClient.get(`${USER_BASE}/me`);
    return response.data;
};

export const fetchUsers = async () => {
    const response = await apiClient.get(USER_BASE);
    return response.data;
};

