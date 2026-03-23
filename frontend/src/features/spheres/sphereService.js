import apiClient from '../../services/apiClient';

const SPHERE_BASE = '/spheres';

export const createSphere = async (payload) => {
    const response = await apiClient.post(SPHERE_BASE, payload);
    return response.data;
};

export const fetchSphereByCode = async (code) => {
    const response = await apiClient.get(`${SPHERE_BASE}/code/${code}`);
    return response.data;
};

export const fetchMySpheres = async () => {
    const response = await apiClient.get(SPHERE_BASE);
    return response.data;
};

