import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    createSphere,
    fetchSphereByCode,
    fetchMySpheres,
} from './sphereService';

const initialState = {
    list: [],
    current: null,
    status: 'idle',
    error: null,
};

export const createSphereThunk = createAsyncThunk(
    'spheres/create',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await createSphere(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create sphere');
        }
    },
);

export const fetchSphereByCodeThunk = createAsyncThunk(
    'spheres/fetchByCode',
    async (code, { rejectWithValue }) => {
        try {
            const data = await fetchSphereByCode(code);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to find sphere');
        }
    },
);

export const fetchMySpheresThunk = createAsyncThunk(
    'spheres/fetchMine',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchMySpheres();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to load spheres');
        }
    },
);

const sphereSlice = createSlice({
    name: 'spheres',
    initialState,
    reducers: {
        clearSphereError(state) {
            state.error = null;
        },
        clearCurrentSphere(state) {
            state.current = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // create
            .addCase(createSphereThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createSphereThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.current = action.payload;
                if (Array.isArray(state.list)) {
                    state.list.push(action.payload);
                }
            })
            .addCase(createSphereThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // fetch by code
            .addCase(fetchSphereByCodeThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSphereByCodeThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.current = action.payload;
            })
            .addCase(fetchSphereByCodeThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // fetch my spheres
            .addCase(fetchMySpheresThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMySpheresThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchMySpheresThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearSphereError, clearCurrentSphere } = sphereSlice.actions;

export default sphereSlice.reducer;

