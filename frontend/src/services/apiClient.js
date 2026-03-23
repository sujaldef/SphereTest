import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        const token =
            typeof window !== 'undefined'
                ? window.localStorage.getItem('spheretest_token')
                : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Optionally normalize error shape
        if (error.response && error.response.data && error.response.data.message) {
            // eslint-disable-next-line no-param-reassign
            error.message = error.response.data.message;
        }
        return Promise.reject(error);
    },
);

export default apiClient;

