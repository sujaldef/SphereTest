import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    createQuestions,
    fetchQuestionsForSphere,
} from './questionService';

const initialState = {
    bySphere: {},
    status: 'idle',
    error: null,
};

export const createQuestionsThunk = createAsyncThunk(
    'questions/create',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await createQuestions(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to save questions');
        }
    },
);

export const fetchQuestionsForSphereThunk = createAsyncThunk(
    'questions/fetchForSphere',
    async (sphereId, { rejectWithValue }) => {
        try {
            const data = await fetchQuestionsForSphere(sphereId);
            return { sphereId, questions: data };
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to load questions');
        }
    },
);

const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        clearQuestionError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createQuestionsThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createQuestionsThunk.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(createQuestionsThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchQuestionsForSphereThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchQuestionsForSphereThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bySphere[action.payload.sphereId] = action.payload.questions;
            })
            .addCase(fetchQuestionsForSphereThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearQuestionError } = questionSlice.actions;

export default questionSlice.reducer;

