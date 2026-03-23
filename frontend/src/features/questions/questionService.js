import apiClient from '../../services/apiClient';

const QUESTION_BASE = '/questions';

export const createQuestions = async ({ sphereId, questions }) => {
    const response = await apiClient.post(QUESTION_BASE, { sphereId, questions });
    return response.data;
};

export const fetchQuestionsForSphere = async (sphereId) => {
    const response = await apiClient.get(`${QUESTION_BASE}/sphere/${sphereId}`);
    return response.data;
};

