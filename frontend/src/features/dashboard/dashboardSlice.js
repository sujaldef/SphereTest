import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDashboard } from './dashboardService';

const initialState = {
  user: null,
  stats: {
    activeSpheres: 0,
    totalPlayers: 0,
    avgScore: 0,
  },
  spheres: [],
  students: [],
  leaderboard: [],
  analytics: {
    topics: [],
    weakAreas: [],
  },
  status: 'idle',
  error: null,
};

export const fetchDashboardThunk = createAsyncThunk(
  'dashboard/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchDashboard();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load dashboard');
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user || null;
        state.stats = action.payload.stats || state.stats;
        state.spheres = action.payload.spheres || [];
        state.students = action.payload.students || [];
        state.leaderboard = action.payload.leaderboard || [];
        state.analytics = action.payload.analytics || state.analytics;
      })
      .addCase(fetchDashboardThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;

