import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMe, fetchUsers } from './userService';

const initialState = {
    me: null,
    list: [],
    status: 'idle',
    error: null,
};

export const fetchMeThunk = createAsyncThunk(
    'users/me',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchMe();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to load user');
        }
    },
);

export const fetchUsersThunk = createAsyncThunk(
    'users/list',
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchUsers();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to load users');
        }
    },
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUserError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchMeThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.me = action.payload;
            })
            .addCase(fetchMeThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchUsersThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUsersThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchUsersThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;

