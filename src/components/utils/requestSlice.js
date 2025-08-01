import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  received: [],
  sent: [],
  totalReceived: 0,
  totalSent: 0,
  currentPage: 1,
  totalPages: 1,
};

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    // Set the received connection requests (paginated)
    setReceivedRequests: (state, action) => {
      state.received = action.payload.requests;
      state.totalReceived = action.payload.total;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
    },

    // Set the sent connection requests
    setSentRequests: (state, action) => {
      state.sent = action.payload.requests;
      state.totalSent = action.payload.total;
    },

    // ⚠️ This overwrites the entire state, which is dangerous unless intentional
    addRequests: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    // ❌ Bug: You're using `state.filter`, but `state` is an object — not an array
    removeRequest: (state, action) => {
      const idToRemove = action.payload;
      state.received = state.received.filter((r) => r._id !== idToRemove);
      state.sent = state.sent.filter((r) => r._id !== idToRemove);
    },
  },
});

export const {
  setReceivedRequests,
  setSentRequests,
  addRequests,
  removeRequest,
} = requestSlice.actions;

export default requestSlice.reducer;
