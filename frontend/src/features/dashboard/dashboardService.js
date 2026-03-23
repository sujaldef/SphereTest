import apiClient from '../../services/apiClient';

const DASHBOARD_BASE = '/dashboard';

export const fetchDashboard = async () => {
  const response = await apiClient.get(DASHBOARD_BASE);
  return response.data;
};

