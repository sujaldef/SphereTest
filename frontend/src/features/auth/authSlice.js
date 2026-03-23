import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, getCurrentUser } from './authService';

const TOKEN_KEY = 'spheretest_token';
const USER_KEY = 'spheretest_user';

const getInitialAuthState = () => {
    if (typeof window === 'undefined') {
        return { user: null, token: null, status: 'idle', error: null };
    }

    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    const storedUser = window.localStorage.getItem(USER_KEY);

    return {
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
        status: 'idle',
        error: null,
    };
};

export const registerThunk = createAsyncThunk(
    'auth/register',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await registerUser(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    },
);

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (payload, { rejectWithValue }) => {
        try {
            const data = await loginUser(payload);
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Login failed');
        }
    },
);

export const fetchCurrentUserThunk = createAsyncThunk(
    'auth/me',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getCurrentUser();
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch user');
        }
    },
);

const initialState = getInitialAuthState();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.status = 'idle';
            state.error = null;
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(TOKEN_KEY);
                window.localStorage.removeItem(USER_KEY);
            }
        },
        clearAuthError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // register
            .addCase(registerThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user || action.payload;
                state.token = action.payload.token || state.token;

                if (typeof window !== 'undefined') {
                    if (state.token) {
                        window.localStorage.setItem(TOKEN_KEY, state.token);
                    }
                    if (state.user) {
                        window.localStorage.setItem(USER_KEY, JSON.stringify(state.user));
                    }
                }
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // login
            .addCase(loginThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user || state.user;
                state.token = action.payload.token;

                if (typeof window !== 'undefined') {
                    if (state.token) {
                        window.localStorage.setItem(TOKEN_KEY, state.token);
                    }
                    if (state.user) {
                        window.localStorage.setItem(USER_KEY, JSON.stringify(state.user));
                    }
                }
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // me
            .addCase(fetchCurrentUserThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
                if (typeof window !== 'undefined' && state.user) {
                    window.localStorage.setItem(USER_KEY, JSON.stringify(state.user));
                }
            })
            .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;

